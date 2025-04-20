import { NextResponse } from "next/server"
import { generateText } from "ai"
import { GoogleGenerativeAI } from "@ai-sdk/google"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { location, query } = await request.json()

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 })
    }

    let cachedData = null

    // Try to get cached data if Supabase is available
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const cacheKey = `weather:${location}:${query || "default"}`
        const { data } = await supabase.from("weather_cache").select("*").eq("cache_key", cacheKey).single()

        // If we have fresh cached data (less than 30 minutes old), return it
        if (data && new Date().getTime() - new Date(data.created_at).getTime() < 30 * 60 * 1000) {
          cachedData = data
        }
      }
    } catch (error) {
      console.error("Error checking cache:", error)
      // Continue without cache
    }

    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData.data))
    }

    // Fetch weather data from OpenWeatherMap
    const weatherData = await fetchWeatherData(location)

    // Generate AI analysis using Gemini if available
    let analysisText
    if (process.env.GEMINI_API_KEY) {
      try {
        analysisText = await generateWeatherAnalysis(weatherData, query)
      } catch (error) {
        console.error("Error generating analysis with Gemini:", error)
        analysisText = generateFallbackAnalysis(weatherData, query)
      }
    } else {
      analysisText = generateFallbackAnalysis(weatherData, query)
    }

    const responseData = {
      weatherData,
      analysisText,
    }

    // Try to cache the data in Supabase if available
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const cacheKey = `weather:${location}:${query || "default"}`
        await supabase.from("weather_cache").upsert({
          cache_key: cacheKey,
          data: JSON.stringify(responseData),
          created_at: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Error caching data:", error)
      // Continue without caching
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error in weather analysis:", error)
    return NextResponse.json({ error: "Failed to analyze weather data" }, { status: 500 })
  }
}

async function fetchWeatherData(location: string) {
  const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY

  if (!OPENWEATHERMAP_API_KEY) {
    throw new Error("OpenWeatherMap API key is not configured")
  }

  // Parse location (could be coordinates or city name)
  let lat, lon, locationName

  if (location.includes(",")) {
    // Handle coordinate format (e.g., "51.9225, 4.4792")
    const [latStr, lonStr] = location.split(",")
    lat = Number.parseFloat(latStr.trim())
    lon = Number.parseFloat(lonStr.trim())
    locationName = `${lat.toFixed(2)}, ${lon.toFixed(2)}`
  } else if (location.toLowerCase().includes("to")) {
    // Handle route format (e.g., "Rotterdam to Hamburg")
    // For simplicity, we'll just use the first location in the route
    const startLocation = location.split("to")[0].trim()
    const geoData = await fetchGeocodingData(startLocation, OPENWEATHERMAP_API_KEY)
    lat = geoData.lat
    lon = geoData.lon
    locationName = location // Keep the full route as the location name
  } else {
    // Handle city name format (e.g., "Rotterdam")
    const geoData = await fetchGeocodingData(location, OPENWEATHERMAP_API_KEY)
    lat = geoData.lat
    lon = geoData.lon
    locationName = location
  }

  // Fetch current weather
  const currentResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`,
  )

  if (!currentResponse.ok) {
    throw new Error(`OpenWeatherMap API error: ${currentResponse.status}`)
  }

  const currentData = await currentResponse.json()

  // Fetch 5-day forecast
  const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`,
  )

  if (!forecastResponse.ok) {
    throw new Error(`OpenWeatherMap API error: ${forecastResponse.status}`)
  }

  const forecastData = await forecastResponse.json()

  // Process and format the data
  const current = {
    temp: currentData.main.temp,
    humidity: currentData.main.humidity,
    wind_speed: currentData.wind.speed,
    wind_deg: currentData.wind.deg,
    weather: currentData.weather,
  }

  // Get daily forecast (OpenWeatherMap returns data in 3-hour intervals)
  // We'll take one reading per day at noon
  const dailyForecasts = []
  const processedDays = new Set()

  for (const item of forecastData.list) {
    const date = new Date(item.dt * 1000)
    const day = date.toISOString().split("T")[0]

    // Only take one reading per day
    if (!processedDays.has(day)) {
      processedDays.add(day)
      dailyForecasts.push({
        dt: item.dt,
        temp: item.main.temp,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        wind_deg: item.wind.deg,
        weather: item.weather,
      })

      // Stop after we have 5 days
      if (dailyForecasts.length >= 5) break
    }
  }

  return {
    location: locationName,
    current,
    forecast: dailyForecasts,
  }
}

async function fetchGeocodingData(location: string, apiKey: string) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`,
  )

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`)
  }

  const data = await response.json()

  if (!data || data.length === 0) {
    throw new Error(`Location not found: ${location}`)
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon,
  }
}

async function generateWeatherAnalysis(weatherData: any, query: string) {
  // Construct a detailed prompt for Gemini
  const prompt = `
    Analyze the following maritime weather data for ${weatherData.location}:
    
    Current conditions: ${weatherData.current.temp.toFixed(1)}°C, ${weatherData.current.weather[0].description}, 
    wind ${weatherData.current.wind_speed.toFixed(1)} m/s from ${getWindDirection(weatherData.current.wind_deg)}
    
    5-day forecast: ${weatherData.forecast
      .map(
        (day: any) =>
          `${new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}: 
      ${day.temp.toFixed(1)}°C, ${day.weather[0].main}, wind ${day.wind_speed.toFixed(1)} m/s from ${getWindDirection(day.wind_deg)}`,
      )
      .join("; ")}
    
    ${query ? `Specifically address: ${query}` : "Provide a maritime-focused analysis of these conditions."}
    
    You are a maritime weather expert. Provide a concise analysis of these conditions, highlighting any potential risks or favorable conditions for sea travel. Include specific maritime terminology where appropriate. Consider factors like wave height, visibility, and navigation challenges.
    
    Format your response in clear paragraphs with appropriate line breaks.
  `

  try {
    // Use the AI SDK to generate text with Gemini
    const { text } = await generateText({
      model: GoogleGenerativeAI("gemini-1.5-flash"),
      prompt: prompt,
      maxTokens: 1024,
    })

    return text
  } catch (error) {
    console.error("Error generating text with Gemini:", error)
    return `Unable to generate weather analysis. Please try again later.`
  }
}

function generateFallbackAnalysis(weatherData: any, query: string) {
  // Generate a basic analysis when Gemini is not available
  const currentTemp = weatherData.current.temp
  const currentWeather = weatherData.current.weather[0].main
  const currentWindSpeed = weatherData.current.wind_speed
  const windDirection = getWindDirection(weatherData.current.wind_deg)

  let analysis = `Current conditions at ${weatherData.location}: ${currentTemp.toFixed(1)}°C, ${currentWeather}, with winds at ${currentWindSpeed.toFixed(1)} m/s from the ${windDirection}.\n\n`

  // Add basic forecast information
  analysis += "5-day forecast summary:\n"
  weatherData.forecast.forEach((day: any) => {
    const date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })
    analysis += `- ${date}: ${day.temp.toFixed(1)}°C, ${day.weather[0].main}, winds at ${day.wind_speed.toFixed(1)} m/s\n`
  })

  // Add basic maritime assessment
  analysis += "\nMaritime assessment:\n"

  if (currentWindSpeed > 10) {
    analysis += "- Current wind conditions may create moderate sea states with waves potentially reaching 2-3 meters.\n"
  } else if (currentWindSpeed > 5) {
    analysis += "- Light to moderate winds should create relatively calm sea conditions with waves under 1.5 meters.\n"
  } else {
    analysis += "- Light winds should result in calm seas with minimal wave activity.\n"
  }

  if (currentWeather.toLowerCase().includes("rain") || currentWeather.toLowerCase().includes("shower")) {
    analysis += "- Precipitation may reduce visibility. Maintain proper lookout and use radar when necessary.\n"
  } else if (currentWeather.toLowerCase().includes("fog") || currentWeather.toLowerCase().includes("mist")) {
    analysis += "- Reduced visibility conditions. Use fog signals and maintain slow, safe speed.\n"
  } else if (currentWeather.toLowerCase().includes("clear") || currentWeather.toLowerCase().includes("sun")) {
    analysis += "- Good visibility conditions should allow for optimal navigation.\n"
  }

  // Add specific response to query if provided
  if (query) {
    if (query.toLowerCase().includes("depart") || query.toLowerCase().includes("when")) {
      const bestDay = weatherData.forecast.reduce(
        (best: any, day: any) => {
          // Simple algorithm: prefer days with less wind and no precipitation
          const score = day.wind_speed * -1 + (day.weather[0].main.toLowerCase().includes("clear") ? 5 : 0)
          return score > best.score ? { day, score } : best
        },
        { day: null, score: Number.NEGATIVE_INFINITY },
      ).day

      if (bestDay) {
        const bestDate = new Date(bestDay.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })
        analysis += `\nRegarding your question about departure timing: ${bestDate} appears to offer the most favorable conditions with ${bestDay.temp.toFixed(1)}°C and ${bestDay.weather[0].main.toLowerCase()} conditions.`
      }
    } else if (query.toLowerCase().includes("risk") || query.toLowerCase().includes("danger")) {
      const highWindDays = weatherData.forecast.filter((day: any) => day.wind_speed > 10)
      if (highWindDays.length > 0) {
        analysis += "\nRegarding your question about risks: Be cautious on "
        analysis += highWindDays
          .map((day: any) => new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" }))
          .join(", ")
        analysis += " due to higher wind conditions that may create challenging sea states."
      } else {
        analysis +=
          "\nRegarding your question about risks: No significant weather risks identified in the forecast period, but always maintain standard maritime safety practices."
      }
    }
  }

  return analysis
}

function getWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}
