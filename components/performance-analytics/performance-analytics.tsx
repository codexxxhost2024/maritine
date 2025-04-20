"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FuelConsumptionChart } from "@/components/performance-analytics/fuel-consumption-chart"
import { EnginePerformanceChart } from "@/components/performance-analytics/engine-performance-chart"
import { EmissionsChart } from "@/components/performance-analytics/emissions-chart"
import { PerformanceMetrics } from "@/components/performance-analytics/performance-metrics"

export function PerformanceAnalytics() {
  const [vessel, setVessel] = useState("vessel-1")
  const [timeRange, setTimeRange] = useState("30d")
  const [performanceData, setPerformanceData] = useState(getMockPerformanceData())

  const handleUpdateData = () => {
    // In a real app, this would fetch data from an API
    // For this demo, we'll just update the mock data with some random variations
    const updatedData = {
      ...getMockPerformanceData(),
      vessel: {
        ...getMockPerformanceData().vessel,
        id: vessel,
      },
    }
    setPerformanceData(updatedData)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vessel Performance Dashboard</CardTitle>
          <CardDescription>Monitor and analyze vessel performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="vessel-select">Select Vessel</Label>
                <Select value={vessel} onValueChange={setVessel}>
                  <SelectTrigger id="vessel-select">
                    <SelectValue placeholder="Select vessel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vessel-1">MV Atlantic Explorer</SelectItem>
                    <SelectItem value="vessel-2">MV Pacific Voyager</SelectItem>
                    <SelectItem value="vessel-3">MV Nordic Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="time-range">Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger id="time-range">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                    <SelectItem value="1y">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateData}>Update Data</Button>
            </div>

            <div className="md:col-span-2">
              <PerformanceMetrics metrics={performanceData.metrics} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="fuel" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fuel">
            <Fuel className="h-4 w-4 mr-2" />
            Fuel Efficiency
          </TabsTrigger>
          <TabsTrigger value="engine">
            <Engine className="h-4 w-4 mr-2" />
            Engine Performance
          </TabsTrigger>
          <TabsTrigger value="emissions">
            <Emissions className="h-4 w-4 mr-2" />
            Emissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fuel">
          <FuelConsumptionChart data={performanceData.fuelConsumption} />
        </TabsContent>

        <TabsContent value="engine">
          <EnginePerformanceChart data={performanceData.enginePerformance} />
        </TabsContent>

        <TabsContent value="emissions">
          <EmissionsChart data={performanceData.emissions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Custom icons
function Fuel(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 22h12" />
      <path d="M8 22V2" />
      <path d="M12 6h4a2 2 0 0 1 2 2v12" />
      <path d="M18 14h-4" />
    </svg>
  )
}

function Engine(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2" />
      <path d="M6 10h4" />
      <path d="M6 14h4" />
      <path d="M14 12h8" />
      <path d="M18 8v8" />
    </svg>
  )
}

function Emissions(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 19h8a4 4 0 0 0 4-4 7 7 0 0 0-7-7h-1a5 5 0 0 0-9 3v1a3 3 0 0 0 3 3h2" />
      <path d="M12 19v3" />
    </svg>
  )
}

// Mock data generator
function getMockPerformanceData() {
  return {
    vessel: {
      id: "vessel-1",
      name: "MV Atlantic Explorer",
      type: "Container Ship",
      grossTonnage: 43000,
    },
    metrics: {
      fuelEfficiency: {
        value: 28.5,
        unit: "g/ton-nm",
        change: -3.2,
        target: 30.0,
      },
      co2Emissions: {
        value: 89.4,
        unit: "g CO₂/ton-nm",
        change: -2.8,
        target: 95.0,
      },
      engineLoad: {
        value: 72.3,
        unit: "%",
        change: 1.5,
        target: 75.0,
      },
      speedEfficiency: {
        value: 94.2,
        unit: "%",
        change: 2.1,
        target: 90.0,
      },
    },
    fuelConsumption: {
      daily: [
        { date: "2023-06-01", consumption: 45.2, distance: 320, speed: 13.5 },
        { date: "2023-06-02", consumption: 43.8, distance: 315, speed: 13.2 },
        { date: "2023-06-03", consumption: 46.5, distance: 330, speed: 13.8 },
        { date: "2023-06-04", consumption: 44.1, distance: 310, speed: 13.0 },
        { date: "2023-06-05", consumption: 42.9, distance: 305, speed: 12.8 },
        { date: "2023-06-06", consumption: 47.3, distance: 335, speed: 14.0 },
        { date: "2023-06-07", consumption: 45.8, distance: 325, speed: 13.6 },
      ],
      bySpeed: [
        { speed: 10, consumption: 32.5 },
        { speed: 12, consumption: 38.7 },
        { speed: 14, consumption: 47.2 },
        { speed: 16, consumption: 58.9 },
        { speed: 18, consumption: 73.4 },
        { speed: 20, consumption: 92.1 },
      ],
      byRoute: [
        { route: "Rotterdam - Singapore", consumption: 1850, distance: 8300 },
        { route: "Singapore - Shanghai", consumption: 720, distance: 2800 },
        { route: "Shanghai - Los Angeles", consumption: 1650, distance: 6500 },
        { route: "Los Angeles - Panama", consumption: 950, distance: 3200 },
        { route: "Panama - New York", consumption: 680, distance: 2000 },
      ],
    },
    enginePerformance: {
      mainEngine: {
        rpm: [
          { date: "2023-06-01", value: 85 },
          { date: "2023-06-02", value: 83 },
          { date: "2023-06-03", value: 86 },
          { date: "2023-06-04", value: 84 },
          { date: "2023-06-05", value: 82 },
          { date: "2023-06-06", value: 87 },
          { date: "2023-06-07", value: 85 },
        ],
        load: [
          { date: "2023-06-01", value: 72 },
          { date: "2023-06-02", value: 70 },
          { date: "2023-06-03", value: 74 },
          { date: "2023-06-04", value: 71 },
          { date: "2023-06-05", value: 69 },
          { date: "2023-06-06", value: 75 },
          { date: "2023-06-07", value: 73 },
        ],
        temperature: [
          { date: "2023-06-01", value: 345 },
          { date: "2023-06-02", value: 342 },
          { date: "2023-06-03", value: 348 },
          { date: "2023-06-04", value: 344 },
          { date: "2023-06-05", value: 340 },
          { date: "2023-06-06", value: 350 },
          { date: "2023-06-07", value: 346 },
        ],
      },
      auxiliaryEngines: {
        load: [
          { date: "2023-06-01", engine1: 65, engine2: 58, engine3: 0 },
          { date: "2023-06-02", engine1: 63, engine2: 60, engine3: 0 },
          { date: "2023-06-03", engine1: 67, engine2: 62, engine3: 55 },
          { date: "2023-06-04", engine1: 64, engine2: 59, engine3: 0 },
          { date: "2023-06-05", engine1: 62, engine2: 57, engine3: 0 },
          { date: "2023-06-06", engine1: 68, engine2: 63, engine3: 58 },
          { date: "2023-06-07", engine1: 66, engine2: 61, engine3: 0 },
        ],
        runningHours: [
          { engine: "AE1", hours: 12500 },
          { engine: "AE2", hours: 11800 },
          { engine: "AE3", hours: 5200 },
        ],
      },
      maintenance: [
        { component: "Main Engine", lastMaintenance: "2023-05-15", nextDue: "2023-08-15", runningHours: 2500 },
        { component: "Auxiliary Engine 1", lastMaintenance: "2023-04-20", nextDue: "2023-07-20", runningHours: 1800 },
        { component: "Auxiliary Engine 2", lastMaintenance: "2023-05-05", nextDue: "2023-08-05", runningHours: 2100 },
        { component: "Auxiliary Engine 3", lastMaintenance: "2023-03-10", nextDue: "2023-09-10", runningHours: 900 },
        { component: "Turbocharger", lastMaintenance: "2023-02-25", nextDue: "2023-08-25", runningHours: 3500 },
      ],
    },
    emissions: {
      co2: [
        { date: "2023-06-01", value: 142.3 },
        { date: "2023-06-02", value: 138.1 },
        { date: "2023-06-03", value: 146.5 },
        { date: "2023-06-04", value: 139.2 },
        { date: "2023-06-05", value: 135.4 },
        { date: "2023-06-06", value: 149.1 },
        { date: "2023-06-07", value: 144.3 },
      ],
      sox: [
        { date: "2023-06-01", value: 0.42 },
        { date: "2023-06-02", value: 0.41 },
        { date: "2023-06-03", value: 0.43 },
        { date: "2023-06-04", value: 0.41 },
        { date: "2023-06-05", value: 0.4 },
        { date: "2023-06-06", value: 0.44 },
        { date: "2023-06-07", value: 0.42 },
      ],
      nox: [
        { date: "2023-06-01", value: 3.2 },
        { date: "2023-06-02", value: 3.1 },
        { date: "2023-06-03", value: 3.3 },
        { date: "2023-06-04", value: 3.1 },
        { date: "2023-06-05", value: 3.0 },
        { date: "2023-06-06", value: 3.4 },
        { date: "2023-06-07", value: 3.2 },
      ],
      eedi: {
        attained: 8.5,
        required: 9.2,
        reference: 11.5,
      },
      cii: {
        value: 10.2,
        rating: "B",
        previousYear: 11.5,
        target: 9.8,
      },
    },
  }
}
