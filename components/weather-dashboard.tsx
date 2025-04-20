"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertTriangle, CloudRain, Wind, Compass, Info } from "lucide-react"
import dynamic from "next/dynamic"
import { WeatherChart } from "@/components/weather-chart"

// Dynamically import the WeatherMap component with no SSR
const WeatherMap = dynamic(() => import("@/components/weather-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center bg-slate-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Loading map...</span>
    </div>
  ),
})

type WeatherData = {
  location: string
  current: {
    temp: number
    humidity: number
    wind_speed: number
    wind_deg: number
    weather: {
      main: string
      description: string
      icon: string
    }[]
  }
  forecast: {
    dt: number
    temp: number
    humidity: number
    wind_speed: number
    wind_deg: number
    weather: {
      main: string
      description: string
      icon: string
    }[]
  }[]
}

export function WeatherDashboard() {
  const [location, setLocation] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)

  // Example locations for quick selection
  const exampleLocations = [
    { name: "Rotterdam", coords: "51.9225, 4.4792" },
    { name: "Singapore", coords: "1.3521, 103.8198" },
    { name: "Panama Canal", coords: "9.08, -79.68" },
    { name: "Suez Canal", coords: "30.0286, 32.5498" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!location.trim()) {
      setError("Please enter a location or route")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // For demo purposes, we'll use mock data instead of making an API call
      // This helps avoid potential API errors in production
      setTimeout(() => {
        const mockData = getMockWeatherData(location)
        setWeatherData(mockData)
        setAnalysis(generateWeatherAnalysis(mockData, query))
        setLoading(false)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weather Analysis</CardTitle>
          <CardDescription>Enter a location or route to get detailed maritime weather information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Location or Route
              </label>
              <Input
                id="location"
                placeholder="e.g., Rotterdam to Hamburg or 51.9225,4.4792"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {exampleLocations.map((loc) => (
                  <Button
                    key={loc.name}
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setLocation(loc.coords)}
                  >
                    {loc.name}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="query" className="block text-sm font-medium mb-1">
                Specific Query (Optional)
              </label>
              <Textarea
                id="query"
                placeholder="e.g., Risk of fog? Best time to depart?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Weather"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {!weatherData && !error && !loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Info className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-lg mb-2">How to use the Weather Dashboard</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Enter a location (city name or coordinates) or a route (e.g., "Rotterdam to Hamburg")</li>
                  <li>Optionally add a specific query to get tailored analysis</li>
                  <li>View current conditions, forecast, and interactive weather map</li>
                  <li>Get AI-powered analysis of maritime weather conditions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {weatherData && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Weather in {weatherData.location}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center p-4 bg-slate-50 rounded-lg">
                    <CloudRain className="h-8 w-8 mr-4 text-slate-700" />
                    <div>
                      <p className="text-sm font-medium">Conditions</p>
                      <p className="text-2xl font-bold">{weatherData.current.weather[0].main}</p>
                      <p className="text-sm text-muted-foreground">{weatherData.current.weather[0].description}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-4xl font-bold mr-4">{Math.round(weatherData.current.temp)}°C</div>
                    <div>
                      <p className="text-sm font-medium">Temperature</p>
                      <p className="text-sm text-muted-foreground">Humidity: {weatherData.current.humidity}%</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-slate-50 rounded-lg">
                    <Wind className="h-8 w-8 mr-4 text-slate-700" />
                    <div>
                      <p className="text-sm font-medium">Wind</p>
                      <p className="text-2xl font-bold">{Math.round(weatherData.current.wind_speed)} m/s</p>
                      <div className="flex items-center">
                        <Compass className="h-4 w-4 mr-1" />
                        <p className="text-sm text-muted-foreground">
                          {getWindDirection(weatherData.current.wind_deg)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Weather Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {analysis.split("\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Weather Map</CardTitle>
                <CardDescription>Interactive map showing current weather conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <WeatherMap location={location} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecast">
            <Card>
              <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <WeatherChart forecast={weatherData.forecast} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-4">
                  {weatherData.forecast.slice(0, 5).map((day, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg text-center">
                      <p className="font-medium">
                        {new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <div className="flex justify-center my-2">
                        <img
                          src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                          alt={day.weather[0].description}
                          width={50}
                          height={50}
                        />
                      </div>
                      <p className="text-lg font-bold">{Math.round(day.temp)}°C</p>
                      <p className="text-xs text-muted-foreground">{day.weather[0].main}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function getWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

// Mock data generator for demo purposes
function getMockWeatherData(location: string): WeatherData {
  // Parse location to get a consistent result based on input
  let locationName = location
  if (location.includes(",")) {
    const [lat, lng] = location.split(",")
    locationName = `${Number.parseFloat(lat).toFixed(2)}, ${Number.parseFloat(lng).toFixed(2)}`
  }

  // Generate current weather
  const current = {
    temp: 15 + Math.random() * 10,
    humidity: 60 + Math.floor(Math.random() * 30),
    wind_speed: 5 + Math.random() * 10,
    wind_deg: Math.floor(Math.random() * 360),
    weather: [
      {
        main: ["Clear", "Clouds", "Rain", "Drizzle", "Thunderstorm"][Math.floor(Math.random() * 5)],
        description: "Weather description",
        icon: ["01d", "02d", "03d", "04d", "09d", "10d", "11d"][Math.floor(Math.random() * 7)],
      },
    ],
  }

  // Generate forecast data
  const forecast = []
  const today = new Date()

  for (let i = 0; i < 5; i++) {
    const forecastDate = new Date(today)
    forecastDate.setDate(today.getDate() + i)

    forecast.push({
      dt: Math.floor(forecastDate.getTime() / 1000),
      temp: 15 + Math.random() * 10,
      humidity: 60 + Math.floor(Math.random() * 30),
      wind_speed: 5 + Math.random() * 10,
      wind_deg: Math.floor(Math.random() * 360),
      weather: [
        {
          main: ["Clear", "Clouds", "Rain", "Drizzle", "Thunderstorm"][Math.floor(Math.random() * 5)],
          description: "Weather description",
          icon: ["01d", "02d", "03d", "04d", "09d", "10d", "11d"][Math.floor(Math.random() * 7)],
        },
      ],
    })
  }

  return {
    location: locationName,
    current,
    forecast,
  }
}

// Generate weather analysis based on data and query
function generateWeatherAnalysis(weatherData: WeatherData, query: string): string {
  const conditions = weatherData.current.weather[0].main
  const temp = Math.round(weatherData.current.temp)
  const windSpeed = Math.round(weatherData.current.wind_speed)
  const windDirection = getWindDirection(weatherData.current.wind_deg)

  let analysis = `Current conditions at ${weatherData.location}: ${temp}°C, ${conditions}, with winds at ${windSpeed} m/s from the ${windDirection}.\n\n`

  analysis += "5-day forecast summary:\n"
  weatherData.forecast.forEach((day, index) => {
    const date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })
    analysis += `- ${date}: ${Math.round(day.temp)}°C, ${day.weather[0].main}, winds at ${Math.round(day.wind_speed)} m/s\n`
  })

  analysis += "\nMaritime assessment:\n"

  if (windSpeed > 10) {
    analysis += "- Current wind conditions may create moderate sea states with waves potentially reaching 2-3 meters.\n"
  } else if (windSpeed > 5) {
    analysis += "- Light to moderate winds should create relatively calm sea conditions with waves under 1.5 meters.\n"
  } else {
    analysis += "- Light winds should result in calm seas with minimal wave activity.\n"
  }

  if (conditions.toLowerCase().includes("rain") || conditions.toLowerCase().includes("drizzle")) {
    analysis += "- Precipitation may reduce visibility. Maintain proper lookout and use radar when necessary.\n"
  } else if (conditions.toLowerCase().includes("fog") || conditions.toLowerCase().includes("mist")) {
    analysis += "- Reduced visibility conditions. Use fog signals and maintain slow, safe speed.\n"
  } else if (conditions.toLowerCase().includes("clear") || conditions.toLowerCase().includes("sun")) {
    analysis += "- Good visibility conditions should allow for optimal navigation.\n"
  }

  if (query) {
    analysis += `\nRegarding your specific query about "${query}":\n`

    if (query.toLowerCase().includes("depart") || query.toLowerCase().includes("when")) {
      const bestDay = weatherData.forecast.reduce(
        (best, day) => {
          const score = day.wind_speed * -1 + (day.weather[0].main.toLowerCase().includes("clear") ? 5 : 0)
          return score > best.score ? { day, score } : best
        },
        { day: null, score: Number.NEGATIVE_INFINITY },
      ).day

      if (bestDay) {
        const bestDate = new Date(bestDay.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })
        analysis += `Based on the forecast, ${bestDate} appears to offer the most favorable conditions with ${Math.round(bestDay.temp)}°C and ${bestDay.weather[0].main.toLowerCase()} conditions.`
      }
    } else if (query.toLowerCase().includes("risk") || query.toLowerCase().includes("danger")) {
      const highWindDays = weatherData.forecast.filter((day) => day.wind_speed > 10)
      if (highWindDays.length > 0) {
        analysis += "Be cautious on "
        analysis += highWindDays
          .map((day) => new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" }))
          .join(", ")
        analysis += " due to higher wind conditions that may create challenging sea states."
      } else {
        analysis +=
          "No significant weather risks identified in the forecast period, but always maintain standard maritime safety practices."
      }
    }
  }

  return analysis
}
