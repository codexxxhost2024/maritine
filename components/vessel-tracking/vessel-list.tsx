"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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

type VesselListProps = {
  vessels: Vessel[]
  loading: boolean
  onSelectVessel: (vessel: Vessel) => void
  selectedVesselId?: string
}

export function VesselList({ vessels, loading, onSelectVessel, selectedVesselId }: VesselListProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vessel List</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading vessels...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vessel Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>MMSI</TableHead>
                  <TableHead>Flag</TableHead>
                  <TableHead>Speed (knots)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Destination</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vessels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No vessels found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  vessels.map((vessel) => (
                    <TableRow
                      key={vessel.id}
                      className={`cursor-pointer hover:bg-muted/50 ${selectedVesselId === vessel.id ? "bg-muted" : ""}`}
                      onClick={() => onSelectVessel(vessel)}
                    >
                      <TableCell className="font-medium">{vessel.name}</TableCell>
                      <TableCell>
                        <Badge className={getVesselTypeColor(vessel.type)}>
                          {vessel.type.charAt(0).toUpperCase() + vessel.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{vessel.mmsi}</TableCell>
                      <TableCell>{vessel.flag}</TableCell>
                      <TableCell>{vessel.speed.toFixed(1)}</TableCell>
                      <TableCell>{vessel.status}</TableCell>
                      <TableCell>{vessel.destination}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
