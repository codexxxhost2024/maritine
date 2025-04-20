"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

type NavigationAlert = {
  id: string
  type: "collision" | "weather" | "shallow" | "traffic" | "restricted"
  title: string
  description: string
  position: {
    lat: number
    lng: number
  }
  distance: number
  severity: "low" | "medium" | "high"
  timestamp: string
}

type NavigationData = {
  position: {
    lat: number
    lng: number
  }
  course: number
  speed: number
  heading: number
  depth: number
  wind: {
    speed: number
    direction: number
  }
  visibility: number
  alerts: NavigationAlert[]
  nearbyVessels: number
  navigationStatus: "underway" | "anchored" | "moored" | "restricted"
  nextWaypoint: {
    name: string
    position: {
      lat: number
      lng: number
    }
    distance: number
    eta: string
  }
}

type NavigationMapProps = {
  navigationData: NavigationData
  center: [number, number]
  zoom: number
}

export default function NavigationMap({ navigationData, center, zoom }: NavigationMapProps) {
  const [isLoading, setIsLoading] = useState(true)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any>({})

  useEffect(() => {
    if (typeof window === "undefined") return

    // Dynamically import Leaflet only on client side
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

        // Create map if container exists and map doesn't exist yet
        if (mapContainerRef.current && !mapRef.current) {
          mapRef.current = L.map(mapContainerRef.current).setView(center, zoom)

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(mapRef.current)
        }

        // Update map view if center or zoom changed
        if (mapRef.current) {
          mapRef.current.setView(center, zoom)
        }

        // Add vessel marker
        if (mapRef.current && navigationData) {
          // Clear existing markers
          if (markersRef.current.vessel) {
            markersRef.current.vessel.remove()
          }

          // Create vessel icon
          const vesselIcon = L.divIcon({
            html: `
              <div class="vessel-marker" style="transform: rotate(${navigationData.course}deg);">
                <div class="vessel-icon"></div>
              </div>
            `,
            className: "",
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          })

          // Add vessel marker
          markersRef.current.vessel = L.marker([navigationData.position.lat, navigationData.position.lng], {
            icon: vesselIcon,
          })
            .addTo(mapRef.current)
            .bindPopup(`
              <div>
                <h3 class="font-bold">Your Vessel</h3>
                <p>Course: ${navigationData.course}°</p>
                <p>Speed: ${navigationData.speed} knots</p>
                <p>Depth: ${navigationData.depth} m</p>
              </div>
            `)

          // Add waypoint marker
          if (markersRef.current.waypoint) {
            markersRef.current.waypoint.remove()
          }

          markersRef.current.waypoint = L.marker([
            navigationData.nextWaypoint.position.lat,
            navigationData.nextWaypoint.position.lng,
          ])
            .addTo(mapRef.current)
            .bindPopup(`
              <div>
                <h3 class="font-bold">${navigationData.nextWaypoint.name}</h3>
                <p>Distance: ${navigationData.nextWaypoint.distance.toFixed(1)} nm</p>
                <p>ETA: ${new Date(navigationData.nextWaypoint.eta).toLocaleTimeString()}</p>
              </div>
            `)

          // Add route line
          if (markersRef.current.route) {
            markersRef.current.route.remove()
          }

          markersRef.current.route = L.polyline(
            [
              [navigationData.position.lat, navigationData.position.lng],
              [navigationData.nextWaypoint.position.lat, navigationData.nextWaypoint.position.lng],
            ],
            { color: "#0070f3", weight: 3, dashArray: "5, 10" },
          ).addTo(mapRef.current)

          // Add alert markers
          navigationData.alerts.forEach((alert, index) => {
            if (markersRef.current[`alert-${alert.id}`]) {
              markersRef.current[`alert-${alert.id}`].remove()
            }

            // Create alert icon based on type and severity
            const getAlertColor = (severity: string) => {
              switch (severity) {
                case "high":
                  return "#ef4444" // Red
                case "medium":
                  return "#f59e0b" // Amber
                case "low":
                  return "#3b82f6" // Blue
                default:
                  return "#6b7280" // Gray
              }
            }

            const alertIcon = L.divIcon({
              html: `
                <div class="alert-marker" style="background-color: ${getAlertColor(alert.severity)};">
                  <div class="alert-pulse" style="border-color: ${getAlertColor(alert.severity)};"></div>
                </div>
              `,
              className: "",
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })

            markersRef.current[`alert-${alert.id}`] = L.marker([alert.position.lat, alert.position.lng], {
              icon: alertIcon,
            })
              .addTo(mapRef.current)
              .bindPopup(`
                <div>
                  <h3 class="font-bold">${alert.title}</h3>
                  <p>${alert.description}</p>
                  <p>Distance: ${alert.distance.toFixed(1)} nm</p>
                </div>
              `)
          })

          // Add nearby vessels (mock data)
          const nearbyVessels = generateNearbyVessels(navigationData.position, navigationData.nearbyVessels)

          nearbyVessels.forEach((vessel, index) => {
            if (markersRef.current[`nearby-${index}`]) {
              markersRef.current[`nearby-${index}`].remove()
            }

            const vesselIcon = L.divIcon({
              html: `
                <div class="nearby-vessel-marker" style="transform: rotate(${vessel.course}deg);">
                  <div class="nearby-vessel-icon"></div>
                </div>
              `,
              className: "",
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })

            markersRef.current[`nearby-${index}`] = L.marker([vessel.position.lat, vessel.position.lng], {
              icon: vesselIcon,
            })
              .addTo(mapRef.current)
              .bindPopup(`
                <div>
                  <h3 class="font-bold">${vessel.name}</h3>
                  <p>Course: ${vessel.course}°</p>
                  <p>Speed: ${vessel.speed.toFixed(1)} knots</p>
                  <p>Distance: ${vessel.distance.toFixed(1)} nm</p>
                </div>
              `)
          })

          // Add CSS for markers
          if (!document.getElementById("navigation-marker-styles")) {
            const style = document.createElement("style")
            style.id = "navigation-marker-styles"
            style.innerHTML = `
              .vessel-marker {
                width: 30px;
                height: 30px;
                position: relative;
              }
              .vessel-icon {
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-bottom: 30px solid #0070f3;
                position: absolute;
                top: 0;
                left: 5px;
              }
              .nearby-vessel-marker {
                width: 20px;
                height: 20px;
                position: relative;
              }
              .nearby-vessel-icon {
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 20px solid #6b7280;
                position: absolute;
                top: 0;
                left: 4px;
              }
              .alert-marker {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                position: relative;
              }
              .alert-pulse {
                position: absolute;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 3px solid;
                top: -5px;
                left: -5px;
                animation: pulse 1.5s infinite;
              }
              @keyframes pulse {
                0% {
                  transform: scale(0.5);
                  opacity: 1;
                }
                100% {
                  transform: scale(1.5);
                  opacity: 0;
                }
              }
            `
            document.head.appendChild(style)
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
      if (mapRef.current) {
        // We don't remove the map on cleanup to preserve state between tab switches
        // mapRef.current.remove()
        // mapRef.current = null
      }
    }
  }, [navigationData, center, zoom])

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

// Generate mock nearby vessels
function generateNearbyVessels(position: { lat: number; lng: number }, count: number) {
  const vessels = []

  for (let i = 0; i < count; i++) {
    // Generate random position within 10nm
    const distance = Math.random() * 10
    const bearing = Math.random() * 360

    // Calculate position based on distance and bearing
    const lat = position.lat + (distance / 60) * Math.cos((bearing * Math.PI) / 180)
    const lng = position.lng + (distance / 60) * Math.sin((bearing * Math.PI) / 180)

    vessels.push({
      name: `Vessel ${i + 1}`,
      position: { lat, lng },
      course: Math.floor(Math.random() * 360),
      speed: Math.random() * 20,
      distance,
    })
  }

  return vessels
}
