"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

type Waypoint = {
  lat: number
  lng: number
  name?: string
}

type WeatherCondition = {
  location: string
  conditions: string
  windSpeed: number
  waveHeight: number
  visibility: string
}

type RouteMapProps = {
  route: Waypoint[]
  weatherConditions: WeatherCondition[]
}

export default function RouteMap({ route, weatherConditions }: RouteMapProps) {
  const [isLoading, setIsLoading] = useState(true)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!route.length) return

    // Dynamically import Leaflet only on client side
    let map: any
    let L: any

    const initializeMap = async () => {
      try {
        setIsLoading(true)

        // Import Leaflet
        L = (await import("leaflet")).default
        await import("leaflet/dist/leaflet.css")

        // Fix for default marker icons
        const DefaultIcon = L.icon({
          iconUrl: "/marker-icon.png",
          iconRetinaUrl: "/marker-icon-2x.png",
          shadowUrl: "/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })

        L.Marker.prototype.options.icon = DefaultIcon

        // Clean up previous map instance if it exists
        if (map) {
          map.remove()
        }

        // Create map if container exists
        if (mapContainerRef.current) {
          // Use first waypoint as initial center
          const initialCenter = route.length > 0 ? [route[0].lat, route[0].lng] : [0, 0]
          map = L.map(mapContainerRef.current).setView(initialCenter, 2)

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map)

          // Add route line
          const routePoints = route.map((point) => [point.lat, point.lng])
          L.polyline(routePoints, { color: "#0070f3", weight: 4, opacity: 0.7 }).addTo(map)

          // Add waypoint markers
          route.forEach((waypoint, index) => {
            const marker = L.marker([waypoint.lat, waypoint.lng]).addTo(map)

            marker.bindPopup(`
              ${waypoint.name || `Waypoint ${index + 1}`}<br>
              Lat: ${waypoint.lat.toFixed(4)}, Lng: ${waypoint.lng.toFixed(4)}
            `)

            if (waypoint.name) {
              marker.bindTooltip(waypoint.name, {
                permanent: true,
                direction: "top",
                offset: [0, -20],
              })
            }
          })

          // Add weather condition markers
          weatherConditions.forEach((condition, index) => {
            // Extract coordinates from location string
            const [lat, lng] = condition.location.split(",").map((coord) => Number.parseFloat(coord.trim()))

            // Create custom weather icon
            const weatherIcon = L.divIcon({
              html: `<div class="weather-icon" style="background-color: rgba(255, 255, 255, 0.8); padding: 5px; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 16px;">${getWeatherEmoji(condition.conditions)}</span>
              </div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              popupAnchor: [0, -16],
            })

            L.marker([lat, lng], { icon: weatherIcon })
              .addTo(map)
              .bindPopup(`
                <div class="weather-popup">
                  <h3 class="font-bold">${condition.conditions}</h3>
                  <p>Wind: ${condition.windSpeed} knots</p>
                  <p>Wave Height: ${condition.waveHeight} meters</p>
                  <p>Visibility: ${condition.visibility}</p>
                </div>
              `)
          })

          // Fit map to route bounds
          if (route.length > 0) {
            const bounds = L.latLngBounds(route.map((point) => [point.lat, point.lng]))
            map.fitBounds(bounds, { padding: [50, 50] })
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error initializing map:", error)
        setIsLoading(false)
      }
    }

    initializeMap()

    // Cleanup function
    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [route, weatherConditions])

  // Helper function to get weather emoji
  function getWeatherEmoji(conditions: string) {
    if (conditions.toLowerCase().includes("storm") || conditions.toLowerCase().includes("hurricane")) {
      return "⛈️"
    } else if (conditions.toLowerCase().includes("rain")) {
      return "🌧️"
    } else if (conditions.toLowerCase().includes("fog")) {
      return "🌫️"
    } else if (conditions.toLowerCase().includes("clear")) {
      return "☀️"
    } else {
      return "☁️"
    }
  }

  return (
    <div className="h-full w-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading map...</span>
        </div>
      )}
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  )
}
