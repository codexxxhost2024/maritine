"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, AlertTriangle, Ship, Info, Search } from "lucide-react"
import dynamic from "next/dynamic"
import { VesselList } from "@/components/vessel-tracking/vessel-list"
import { VesselDetails } from "@/components/vessel-tracking/vessel-details"

// Dynamically import the VesselMap component with no SSR
const VesselMap = dynamic(() => import("@/components/vessel-tracking/vessel-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-slate-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Loading map...</span>
    </div>
  ),
})

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

export function VesselTracking() {
  const [searchQuery, setSearchQuery] = useState("")
  const [vesselType, setVesselType] = useState("all")
  const [areaFilter, setAreaFilter] = useState("global")
  const [showOnlyMoving, setShowOnlyMoving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vessels, setVessels] = useState<Vessel[]>(getMockVessels())
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0])
  const [mapZoom, setMapZoom] = useState(2)

  // Example areas for quick selection
  const predefinedAreas = [
    { name: "Global View", coords: [0, 0], zoom: 2 },
    { name: "North Atlantic", coords: [40, -40], zoom: 4 },
    { name: "Mediterranean", coords: [38, 15], zoom: 5 },
    { name: "South China Sea", coords: [15, 115], zoom: 5 },
  ]

  const handleSearch = () => {
    setLoading(true)
    setError(null)

    try {
      // In a real application, this would be an API call to fetch vessel data
      // For this demo, we'll filter the mock data
      let filteredVessels = getMockVessels()

      // Apply search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredVessels = filteredVessels.filter(
          (vessel) =>
            vessel.name.toLowerCase().includes(query) ||
            vessel.mmsi.includes(query) ||
            vessel.imo.includes(query) ||
            vessel.destination.toLowerCase().includes(query),
        )
      }

      // Apply vessel type filter
      if (vesselType !== "all") {
        filteredVessels = filteredVessels.filter((vessel) => vessel.type.toLowerCase() === vesselType)
      }

      // Apply moving vessels filter
      if (showOnlyMoving) {
        filteredVessels = filteredVessels.filter((vessel) => vessel.speed > 0)
      }

      // Apply area filter (in a real app, this would be a geographic filter)
      if (areaFilter !== "global") {
        // This is a simplified example - in a real app, you would filter by geographic bounds
        const areaFilters = {
          "north-atlantic": (v: Vessel) => v.position.lat > 20 && v.position.lat < 60 && v.position.lng < 0,
          mediterranean: (v: Vessel) =>
            v.position.lat > 30 && v.position.lat < 45 && v.position.lng > 0 && v.position.lng < 30,
          "south-china-sea": (v: Vessel) =>
            v.position.lat > 0 && v.position.lat < 25 && v.position.lng > 100 && v.position.lng < 125,
        }

        const filterFn = areaFilters[areaFilter as keyof typeof areaFilters]
        if (filterFn) {
          filteredVessels = filteredVessels.filter(filterFn)
        }
      }

      setVessels(filteredVessels)
      setSelectedVessel(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectVessel = (vessel: Vessel) => {
    setSelectedVessel(vessel)
    setMapCenter([vessel.position.lat, vessel.position.lng])
    setMapZoom(12)
  }

  const handleAreaSelect = (area: { name: string; coords: [number, number]; zoom: number }) => {
    setMapCenter(area.coords)
    setMapZoom(area.zoom)

    // Set the corresponding area filter
    if (area.name === "Global View") {
      setAreaFilter("global")
    } else if (area.name === "North Atlantic") {
      setAreaFilter("north-atlantic")
    } else if (area.name === "Mediterranean") {
      setAreaFilter("mediterranean")
    } else if (area.name === "South China Sea") {
      setAreaFilter("south-china-sea")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vessel Search & Filters</CardTitle>
          <CardDescription>Search for vessels by name, MMSI, IMO, or destination</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="search-query">Search</Label>
                <div className="flex gap-2">
                  <Input
                    id="search-query"
                    placeholder="Vessel name, MMSI, IMO..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button onClick={handleSearch} className="flex-shrink-0">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="vessel-type">Vessel Type</Label>
                <Select value={vesselType} onValueChange={setVesselType}>
                  <SelectTrigger id="vessel-type">
                    <SelectValue placeholder="Select vessel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="cargo">Cargo</SelectItem>
                    <SelectItem value="tanker">Tanker</SelectItem>
                    <SelectItem value="passenger">Passenger</SelectItem>
                    <SelectItem value="fishing">Fishing</SelectItem>
                    <SelectItem value="tug">Tug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="area-filter">Area</Label>
                <Select value={areaFilter} onValueChange={setAreaFilter}>
                  <SelectTrigger id="area-filter">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="north-atlantic">North Atlantic</SelectItem>
                    <SelectItem value="mediterranean">Mediterranean</SelectItem>
                    <SelectItem value="south-china-sea">South China Sea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-moving"
                  checked={showOnlyMoving}
                  onCheckedChange={(checked) => setShowOnlyMoving(checked as boolean)}
                />
                <Label htmlFor="show-moving">Show only moving vessels</Label>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Quick View Areas</Label>
              <div className="grid grid-cols-2 gap-2">
                {predefinedAreas.map((area) => (
                  <Button key={area.name} variant="outline" size="sm" onClick={() => handleAreaSelect(area)}>
                    {area.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="details">Vessel Details</TabsTrigger>
        </TabsList>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ship className="h-5 w-5 mr-2" />
                Vessel Map
              </CardTitle>
              <CardDescription>
                {vessels.length} vessels displayed • {loading ? "Updating..." : "Last updated: Just now"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <VesselMap
                  vessels={vessels}
                  selectedVessel={selectedVessel}
                  onSelectVessel={handleSelectVessel}
                  center={mapCenter}
                  zoom={mapZoom}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <VesselList
            vessels={vessels}
            loading={loading}
            onSelectVessel={handleSelectVessel}
            selectedVesselId={selectedVessel?.id}
          />
        </TabsContent>

        <TabsContent value="details">
          {selectedVessel ? (
            <VesselDetails vessel={selectedVessel} />
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Info className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-lg mb-2">No Vessel Selected</h3>
                    <p className="text-muted-foreground">
                      Select a vessel from the map or list view to see detailed information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock data generator
function getMockVessels(): Vessel[] {
  const vesselTypes = ["cargo", "tanker", "passenger", "fishing", "tug"]
  const flags = ["Panama", "Liberia", "Marshall Islands", "Hong Kong", "Singapore", "Malta"]
  const statuses = ["Underway", "At anchor", "Moored", "Underway using engine", "Restricted maneuverability"]

  const mockVessels: Vessel[] = []

  // Generate 50 mock vessels
  for (let i = 0; i < 50; i++) {
    const type = vesselTypes[Math.floor(Math.random() * vesselTypes.length)]
    const flag = flags[Math.floor(Math.random() * flags.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    // Generate a position based on the vessel index to spread them around
    const lat = Math.random() * 140 - 70 // -70 to 70
    const lng = Math.random() * 360 - 180 // -180 to 180

    // Generate a random speed, with 20% chance of being stationary
    const speed = Math.random() < 0.2 ? 0 : Math.random() * 20

    mockVessels.push({
      id: `vessel-${i}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Vessel ${i + 1}`,
      mmsi: Math.floor(100000000 + Math.random() * 900000000).toString(),
      imo: `IMO${Math.floor(1000000 + Math.random() * 9000000)}`,
      type,
      flag,
      position: { lat, lng },
      course: Math.floor(Math.random() * 360),
      speed,
      destination:
        speed === 0
          ? "N/A"
          : ["Rotterdam", "Singapore", "Shanghai", "New York", "Dubai"][Math.floor(Math.random() * 5)],
      eta:
        speed === 0
          ? "N/A"
          : new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status,
      length: 100 + Math.floor(Math.random() * 200),
      width: 15 + Math.floor(Math.random() * 30),
      draft: 5 + Math.floor(Math.random() * 10),
      lastUpdate: new Date().toISOString(),
    })
  }

  return mockVessels
}
