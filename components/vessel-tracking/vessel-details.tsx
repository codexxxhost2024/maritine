"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ship, Flag, Anchor, Navigation, Clock, MapPin, Info } from "lucide-react"

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

type VesselDetailsProps = {
  vessel: Vessel
}

export function VesselDetails({ vessel }: VesselDetailsProps) {
  // Get vessel type badge color
  const getVesselTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "cargo":
        return "bg-blue-500"
      case "tanker":
        return "bg-red-500"
      case "passenger":
        return "bg-green-500"
      case "fishing":
        return "bg-amber-500"
      case "tug":
        return "bg-purple-500"
      default:
        return "bg-slate-500"
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes("underway")) return "bg-green-500"
    if (status.toLowerCase().includes("anchor")) return "bg-amber-500"
    if (status.toLowerCase().includes("moored")) return "bg-blue-500"
    if (status.toLowerCase().includes("restricted")) return "bg-purple-500"
    return "bg-slate-500"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ship className="h-5 w-5 mr-2" />
            {vessel.name}
            <Badge className={`ml-3 ${getVesselTypeColor(vessel.type)}`}>
              {vessel.type.charAt(0).toUpperCase() + vessel.type.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vessel Identifiers</p>
                  <p>
                    <span className="font-medium">MMSI:</span> {vessel.mmsi}
                  </p>
                  <p>
                    <span className="font-medium">IMO:</span> {vessel.imo}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Flag className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Flag & Registration</p>
                  <p>
                    <span className="font-medium">Flag:</span> {vessel.flag}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Anchor className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vessel Dimensions</p>
                  <p>
                    <span className="font-medium">Length:</span> {vessel.length} m
                  </p>
                  <p>
                    <span className="font-medium">Width:</span> {vessel.width} m
                  </p>
                  <p>
                    <span className="font-medium">Draft:</span> {vessel.draft} m
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Navigation className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Navigation Status</p>
                  <p>
                    <Badge className={getStatusColor(vessel.status)}>{vessel.status}</Badge>
                  </p>
                  <p>
                    <span className="font-medium">Speed:</span> {vessel.speed.toFixed(1)} knots
                  </p>
                  <p>
                    <span className="font-medium">Course:</span> {vessel.course}°
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Position</p>
                  <p>
                    <span className="font-medium">Latitude:</span> {vessel.position.lat.toFixed(6)}
                  </p>
                  <p>
                    <span className="font-medium">Longitude:</span> {vessel.position.lng.toFixed(6)}
                  </p>
                  <p>
                    <span className="font-medium">Last Update:</span> {new Date(vessel.lastUpdate).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Voyage Information</p>
                  <p>
                    <span className="font-medium">Destination:</span> {vessel.destination}
                  </p>
                  <p>
                    <span className="font-medium">ETA:</span> {vessel.eta}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="voyage" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="voyage">Voyage History</TabsTrigger>
          <TabsTrigger value="safety">Safety Information</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
        </TabsList>

        <TabsContent value="voyage">
          <Card>
            <CardHeader>
              <CardTitle>Recent Voyage History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Voyage history data is available with a premium subscription.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety">
          <Card>
            <CardHeader>
              <CardTitle>Safety Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Safety information is available with a premium subscription.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Technical details are available with a premium subscription.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
