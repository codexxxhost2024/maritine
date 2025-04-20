"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Compass, AlertTriangle, Navigation, MapPin, Anchor, LifeBuoy, Wind } from "lucide-react"
import dynamic from "next/dynamic"
import { NavigationAlerts } from "@/components/navigation-assistant/navigation-alerts"
import { NavigationInstruments } from "@/components/navigation-assistant/navigation-instruments"

// Dynamically import the NavigationMap component with no SSR
const NavigationMap = dynamic(() => import("@/components/navigation-assistant/navigation-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Compass className="h-8 w-8 animate-pulse text-primary mx-auto mb-2" />
        <span>Loading navigation map...</span>
      </div>
    </div>
  ),
})

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

export function NavigationAssistant() {
  const [position, setPosition] = useState<string>("")
  const [navigationData, setNavigationData] = useState<NavigationData | null>(getMockNavigationData())
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.9225, 4.4792]) // Default to Rotterdam
  const [mapZoom, setMapZoom] = useState(12)

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(e.target.value)
  }

  const handleUpdatePosition = () => {
    // In a real app, this would update the position based on user input
    // For this demo, we'll just update the mock data
    if (position) {
      try {
        // Try to parse as coordinates (lat,lng)
        const [lat, lng] = position.split(",").map((coord) => Number.parseFloat(coord.trim()))
        if (!isNaN(lat) && !isNaN(lng)) {
          const updatedData = {
            ...getMockNavigationData(),
            position: { lat, lng },
          }
          setNavigationData(updatedData)
          setMapCenter([lat, lng])
        }
      } catch (error) {
        console.error("Invalid position format", error)
      }
    }
  }

  const handleUseCurrentPosition = () => {
    // In a real app, this would use the browser's geolocation API
    // For this demo, we'll just set a random position
    const lat = 51.9225 + (Math.random() - 0.5) * 0.1
    const lng = 4.4792 + (Math.random() - 0.5) * 0.1
    const updatedData = {
      ...getMockNavigationData(),
      position: { lat, lng },
    }
    setNavigationData(updatedData)
    setMapCenter([lat, lng])
    setPosition(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Navigation Assistant</CardTitle>
          <CardDescription>Enhanced navigation with AI-powered recommendations and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-2">
              <div className="flex gap-2">
                <Input placeholder="Enter position (lat, lng)" value={position} onChange={handlePositionChange} />
                <Button onClick={handleUpdatePosition}>Update</Button>
                <Button variant="outline" onClick={handleUseCurrentPosition}>
                  Use Current
                </Button>
              </div>

              {navigationData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Navigation className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Course</p>
                        <p className="text-lg font-bold">{navigationData.course}°</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Anchor className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Speed</p>
                        <p className="text-lg font-bold">{navigationData.speed} kts</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Wind className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Wind</p>
                        <p className="text-lg font-bold">{navigationData.wind.speed} kts</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <LifeBuoy className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Depth</p>
                        <p className="text-lg font-bold">{navigationData.depth} m</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            <div>
              {navigationData && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Current Position</p>
                      <p className="text-xs text-muted-foreground">
                        Lat: {navigationData.position.lat.toFixed(6)}, Lng: {navigationData.position.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Compass className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Next Waypoint</p>
                      <p className="text-xs text-muted-foreground">
                        {navigationData.nextWaypoint.name} - {navigationData.nextWaypoint.distance.toFixed(1)} nm
                      </p>
                      <p className="text-xs text-muted-foreground">ETA: {navigationData.nextWaypoint.eta}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">Active Alerts</p>
                      <p className="text-xs text-muted-foreground">
                        {navigationData.alerts.length} alerts • {navigationData.nearbyVessels} nearby vessels
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {navigationData && (
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="map">Navigation Map</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Warnings</TabsTrigger>
            <TabsTrigger value="instruments">Navigation Instruments</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Compass className="h-5 w-5 mr-2" />
                  Navigation Map
                </CardTitle>
                <CardDescription>Interactive navigation map with route, alerts, and nearby vessels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px]">
                  <NavigationMap navigationData={navigationData} center={mapCenter} zoom={mapZoom} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <NavigationAlerts alerts={navigationData.alerts} />
          </TabsContent>

          <TabsContent value="instruments">
            <NavigationInstruments navigationData={navigationData} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// Mock data generator
function getMockNavigationData(): NavigationData {
  return {
    position: {
      lat: 51.9225,
      lng: 4.4792,
    },
    course: 78,
    speed: 12.5,
    heading: 80,
    depth: 15.3,
    wind: {
      speed: 18,
      direction: 225,
    },
    visibility: 8.5,
    alerts: [
      {
        id: "alert-1",
        type: "collision",
        title: "Collision Risk",
        description: "Vessel on collision course 2nm ahead. Recommended action: Alter course to starboard.",
        position: {
          lat: 51.9245,
          lng: 4.4892,
        },
        distance: 2.0,
        severity: "high",
        timestamp: new Date().toISOString(),
      },
      {
        id: "alert-2",
        type: "shallow",
        title: "Shallow Water",
        description: "Approaching shallow water area. Depth may decrease to 8m.",
        position: {
          lat: 51.9255,
          lng: 4.4852,
        },
        distance: 1.5,
        severity: "medium",
        timestamp: new Date().toISOString(),
      },
      {
        id: "alert-3",
        type: "weather",
        title: "Weather Alert",
        description: "Strong winds expected in 30 minutes. Wind speed may increase to 25 knots.",
        position: {
          lat: 51.9225,
          lng: 4.4792,
        },
        distance: 0,
        severity: "medium",
        timestamp: new Date().toISOString(),
      },
      {
        id: "alert-4",
        type: "restricted",
        title: "Restricted Area",
        description: "Military exercise area ahead. Recommended to avoid this region.",
        position: {
          lat: 51.9325,
          lng: 4.4992,
        },
        distance: 5.2,
        severity: "low",
        timestamp: new Date().toISOString(),
      },
    ],
    nearbyVessels: 8,
    navigationStatus: "underway",
    nextWaypoint: {
      name: "Rotterdam Harbor Entrance",
      position: {
        lat: 51.9325,
        lng: 4.5092,
      },
      distance: 3.5,
      eta: "2023-06-15T14:30:00Z",
    },
  }
}
