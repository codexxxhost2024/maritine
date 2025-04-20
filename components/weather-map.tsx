"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

export default function WeatherMap({ location }: { location: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [coordinates, setCoordinates] = useState<[number, number]>([51.9225, 4.4792])

  useEffect(() => {
    // Parse location and update coordinates
    if (location && location.includes(",")) {
      const [latStr, lngStr] = location.split(",")
      const lat = Number.parseFloat(latStr.trim())
      const lng = Number.parseFloat(lngStr.trim())

      if (!isNaN(lat) && !isNaN(lng)) {
        setCoordinates([lat, lng])
      }
    }
  }, [location])

  useEffect(() => {
    if (typeof window === "undefined") return

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
          map = L.map(mapContainerRef.current).setView(coordinates, 8)

          // Add tile layers
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map)

          // Add marker
          L.marker(coordinates).addTo(map).bindPopup(location).openPopup()
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
  }, [coordinates])

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
