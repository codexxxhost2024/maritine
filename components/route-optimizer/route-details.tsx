"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Clock, Fuel } from "lucide-react"

type RouteData = {
  origin: string
  destination: string
  optimizedRoute: {
    waypoints: Array<{
      lat: number
      lng: number
      name?: string
    }>
    distance: number
    duration: number
    fuelConsumption: number
    co2Emissions: number
  }
  alternatives: Array<{
    id: string
    name: string
    duration: number
    distance: number
    fuelConsumption: number
    co2Emissions: number
    weatherRisk: "low" | "medium" | "high"
  }>
  weatherConditions: Array<{
    location: string
    conditions: string
    windSpeed: number
    waveHeight: number
    visibility: string
  }>
  analysis: string
}

type RouteDetailsProps = {
  routeData: RouteData
}

export function RouteDetails({ routeData }: RouteDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alternative Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Distance (nm)</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Fuel (mt)</TableHead>
                <TableHead>CO₂ (mt)</TableHead>
                <TableHead>Weather Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-green-50">
                <TableCell className="font-medium">Optimized Route (Recommended)</TableCell>
                <TableCell>{routeData.optimizedRoute.distance.toLocaleString()}</TableCell>
                <TableCell>
                  {Math.floor(routeData.optimizedRoute.duration / 24)} days {routeData.optimizedRoute.duration % 24} hrs
                </TableCell>
                <TableCell>{routeData.optimizedRoute.fuelConsumption.toLocaleString()}</TableCell>
                <TableCell>{routeData.optimizedRoute.co2Emissions.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className="bg-green-500">Low</Badge>
                </TableCell>
              </TableRow>

              {routeData.alternatives.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.name}</TableCell>
                  <TableCell>{route.distance.toLocaleString()}</TableCell>
                  <TableCell>
                    {Math.floor(route.duration / 24)} days {route.duration % 24} hrs
                  </TableCell>
                  <TableCell>{route.fuelConsumption.toLocaleString()}</TableCell>
                  <TableCell>{route.co2Emissions.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        route.weatherRisk === "low"
                          ? "bg-green-500"
                          : route.weatherRisk === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }
                    >
                      {route.weatherRisk.charAt(0).toUpperCase() + route.weatherRisk.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weather Conditions Along Route</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Wind Speed (knots)</TableHead>
                <TableHead>Wave Height (m)</TableHead>
                <TableHead>Visibility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routeData.weatherConditions.map((condition, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">Point {index + 1}</TableCell>
                  <TableCell>{condition.conditions}</TableCell>
                  <TableCell>{condition.windSpeed}</TableCell>
                  <TableCell>{condition.waveHeight}</TableCell>
                  <TableCell>{condition.visibility}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Route Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Time Savings
              </h3>
              <div className="space-y-4">
                {routeData.alternatives.map((route) => {
                  const timeDiff = route.duration - routeData.optimizedRoute.duration
                  return (
                    <div key={`time-${route.id}`} className="flex justify-between items-center">
                      <span>vs. {route.name}</span>
                      <Badge variant={timeDiff > 0 ? "default" : "destructive"}>
                        {timeDiff > 0
                          ? `Save ${Math.floor(timeDiff / 24)} days ${timeDiff % 24} hrs`
                          : `Lose ${Math.floor(Math.abs(timeDiff) / 24)} days ${Math.abs(timeDiff) % 24} hrs`}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Fuel className="h-5 w-5 mr-2 text-green-500" />
                Fuel Savings
              </h3>
              <div className="space-y-4">
                {routeData.alternatives.map((route) => {
                  const fuelDiff = route.fuelConsumption - routeData.optimizedRoute.fuelConsumption
                  return (
                    <div key={`fuel-${route.id}`} className="flex justify-between items-center">
                      <span>vs. {route.name}</span>
                      <Badge variant={fuelDiff > 0 ? "default" : "destructive"}>
                        {fuelDiff > 0
                          ? `Save ${fuelDiff.toLocaleString()} mt`
                          : `Use ${Math.abs(fuelDiff).toLocaleString()} mt more`}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
