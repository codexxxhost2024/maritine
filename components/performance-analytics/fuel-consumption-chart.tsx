"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

type FuelConsumptionChartProps = {
  data: {
    daily: Array<{
      date: string
      consumption: number
      distance: number
      speed: number
    }>
    bySpeed: Array<{
      speed: number
      consumption: number
    }>
    byRoute: Array<{
      route: string
      consumption: number
      distance: number
    }>
  }
}

export function FuelConsumptionChart({ data }: FuelConsumptionChartProps) {
  // Daily consumption data
  const dailyData: ChartData<"line"> = {
    labels: data.daily.map((item) =>
      new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    ),
    datasets: [
      {
        label: "Fuel Consumption (mt/day)",
        data: data.daily.map((item) => item.consumption),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Speed (knots)",
        data: data.daily.map((item) => item.speed),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        yAxisID: "y1",
      },
    ],
  }

  const dailyOptions: ChartOptions<"line"> = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Daily Fuel Consumption vs. Speed",
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Fuel Consumption (mt/day)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Speed (knots)",
        },
      },
    },
  }

  // Consumption by speed data
  const bySpeedData: ChartData<"line"> = {
    labels: data.bySpeed.map((item) => `${item.speed} knots`),
    datasets: [
      {
        label: "Fuel Consumption (mt/day)",
        data: data.bySpeed.map((item) => item.consumption),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
    ],
  }

  const bySpeedOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Fuel Consumption by Speed",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Fuel Consumption (mt/day)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Speed (knots)",
        },
      },
    },
  }

  // Consumption by route data
  const byRouteData: ChartData<"bar"> = {
    labels: data.byRoute.map((item) => item.route),
    datasets: [
      {
        label: "Fuel Consumption (mt)",
        data: data.byRoute.map((item) => item.consumption),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
      {
        label: "Distance (nm)",
        data: data.byRoute.map((item) => item.distance),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
      },
    ],
  }

  const byRouteOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Fuel Consumption by Route",
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  }

  // Calculate efficiency metrics
  const totalConsumption = data.byRoute.reduce((sum, item) => sum + item.consumption, 0)
  const totalDistance = data.byRoute.reduce((sum, item) => sum + item.distance, 0)
  const averageEfficiency = totalDistance > 0 ? (totalConsumption / totalDistance) * 1000 : 0 // g/ton-nm

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fuel Consumption Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">
                <LineChart className="h-4 w-4 mr-2" />
                Daily Trend
              </TabsTrigger>
              <TabsTrigger value="speed">
                <LineChart className="h-4 w-4 mr-2" />
                By Speed
              </TabsTrigger>
              <TabsTrigger value="route">
                <BarChart className="h-4 w-4 mr-2" />
                By Route
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="pt-4">
              <div className="h-[400px]">
                <Line options={dailyOptions} data={dailyData} />
              </div>
            </TabsContent>

            <TabsContent value="speed" className="pt-4">
              <div className="h-[400px]">
                <Line options={bySpeedOptions} data={bySpeedData} />
              </div>
            </TabsContent>

            <TabsContent value="route" className="pt-4">
              <div className="h-[400px]">
                <Line options={byRouteOptions} data={byRouteData} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Total Consumption</h3>
            <p className="text-2xl font-bold">{totalConsumption.toLocaleString()} mt</p>
            <p className="text-sm text-muted-foreground">Across all routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Total Distance</h3>
            <p className="text-2xl font-bold">{totalDistance.toLocaleString()} nm</p>
            <p className="text-sm text-muted-foreground">Across all routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Average Efficiency</h3>
            <p className="text-2xl font-bold">{averageEfficiency.toFixed(2)} g/ton-nm</p>
            <p className="text-sm text-muted-foreground">Fuel per ton-nautical mile</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
