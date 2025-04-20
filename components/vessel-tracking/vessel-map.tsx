"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

type Vessel = {
  id: string
  name: string
  mmsi: string
  imo: string
  type: string
  flag: string
  position: {
    lat: number
    lng: number
  }
  course: number
  speed: number
  destination: string
  eta: string
  status: string
  length: number
  width: number
  draft: number
  lastUpdate: string
}

type VesselMapProps = {
  vessels: Vessel[]
  selectedVessel: Vessel | null
  onSelectVessel: (vessel: Vessel) => void
  center: [number, number]
  zoom: number
}

export default function VesselMap({ vessels, selectedVessel, onSelectVessel, center, zoom }: VesselMapProps) {
  const [isLoading, setIsLoading] = useState(true)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any>({})

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!vessels.length) return

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
  }, [center, zoom])

  // Update markers when vessels change
  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return

    const updateMarkers = async () => {
      const L = (await import("leaflet")).default

      // Create vessel icon based on type and status
      const createVesselIcon = (vessel: Vessel) => {
        const isMoving = vessel.speed > 0
        const isSelected = selectedVessel?.id === vessel.id

        // Determine color based on vessel type
        let color = "#3b82f6" // Default blue
        if (vessel.type === "tanker") color = "#ef4444" // Red
        if (vessel.type === "passenger") color = "#10b981" // Green
        if (vessel.type === "fishing") color = "#f59e0b" // Amber
        if (vessel.type === "tug") color = "#8b5cf6" // Purple

        // Create a custom divIcon for the vessel
        return L.divIcon({
          html: `
            <div class="vessel-marker ${isSelected ? "selected" : ""}" 
                 style="transform: rotate(${vessel.course}deg); 
                        background-color: ${color}; 
                        border: ${isSelected ? "2px solid white" : "none"};
                        box-shadow: ${isSelected ? "0 0 0 2px #3b82f6" : "none"};
                        opacity: ${isMoving ? "1" : "0.6"};">
              <div class="vessel-arrow"></div>
            </div>
          `,
          className: "",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })
      }

      // Remove old markers that are no longer in the vessels array
      Object.keys(markersRef.current).forEach((id) => {
        if (!vessels.find((v) => v.id === id)) {
          if (markersRef.current[id]) {
            markersRef.current[id].remove()
            delete markersRef.current[id]
          }
        }
      })

      // Add or update markers for each vessel
      vessels.forEach((vessel) => {
        const icon = createVesselIcon(vessel)

        if (markersRef.current[vessel.id]) {
          // Update existing marker
          markersRef.current[vessel.id].setLatLng([vessel.position.lat, vessel.position.lng])
          markersRef.current[vessel.id].setIcon(icon)
          markersRef.current[vessel.id].setPopupContent(`
            <div>
              <h3 class="font-bold">${vessel.name}</h3>
              <p>Type: ${vessel.type}</p>
              <p>Speed: ${vessel.speed.toFixed(1)} knots</p>
              <p>Status: ${vessel.status}</p>
              <button class="details-btn">View Details</button>
            </div>
          `)
        } else {
          // Create new marker
          const marker = L.marker([vessel.position.lat, vessel.position.lng], { icon })
            .addTo(mapRef.current)
            .bindPopup(`
              <div>
                <h3 class="font-bold">${vessel.name}</h3>
                <p>Type: ${vessel.type}</p>
                <p>Speed: ${vessel.speed.toFixed(1)} knots</p>
                <p>Status: ${vessel.status}</p>
                <button class="details-btn">View Details</button>
              </div>
            `)

          // Add click handler
          marker.on("click", () => {
            setTimeout(() => {
              const detailsBtn = document.querySelector(".details-btn")
              if (detailsBtn) {
                detailsBtn.addEventListener("click", () => {
                  onSelectVessel(vessel)
                  marker.closePopup()
                })
              }
            }, 100)
          })

          markersRef.current[vessel.id] = marker
        }
      })

      // Add CSS for vessel markers
      if (!document.getElementById("vessel-marker-styles")) {
        const style = document.createElement("style")
        style.id = "vessel-marker-styles"
        style.innerHTML = `
          .vessel-marker {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            position: relative;
            transition: all 0.3s ease;
          }
          .vessel-marker.selected {
            z-index: 1000 !important;
            transform-origin: center;
          }
          .vessel-arrow {
            position: absolute;
            top: -5px;
            left: 8px;
            width: 0;
            height: 0;
            border-left: 2px solid transparent;
            border-right: 2px solid transparent;
            border-bottom: 8px solid white;
            transform-origin: bottom center;
          }
          .details-btn {
            background-color: #3b82f6;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            margin-top: 8px;
            cursor: pointer;
            font-size: 12px;
          }
          .details-btn:hover {
            background-color: #2563eb;
          }
        `
        document.head.appendChild(style)
      }
    }

    updateMarkers()
  }, [vessels, selectedVessel, onSelectVessel])

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
