"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

type EnginePerformanceChartProps = {
  data: {
    mainEngine: {
      rpm: Array<{
        date: string
        value: number
      }>
      load: Array<{
        date: string
        value: number
      }>
      temperature: Array<{
        date: string
        value: number
      }>
    }
    auxiliaryEngines: {
      load: Array<{
        date: string
        engine1: number
        engine2: number
        engine3: number
      }>
      runningHours: Array<{
        engine: string
        hours: number
      }>
    }
    maintenance: Array<{
      component: string
      lastMaintenance: string
      nextDue: string
      runningHours: number
    }>
  }
}

export function EnginePerformanceChart({ data }: EnginePerformanceChartProps) {
  // Main engine data
  const mainEngineData: ChartData<"line"> = {
    labels: data.mainEngine.rpm.map((item) =>
      new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    ),
    datasets: [
      {
        label: "RPM",
        data: data.mainEngine.rpm.map((item) => item.value),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Load (%)",
        data: data.mainEngine.load.map((item) => item.value),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        yAxisID: "y1",
      },
      {
        label: "Temperature (°C)",
        data: data.mainEngine.temperature.map((item) => item.value),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        yAxisID: "y2",
      },
    ],
  }

  const mainEngineOptions: ChartOptions<"line"> = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Main Engine Performance",
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "RPM",
        },
        min: 70,
        max: 100,
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
          text: "Load (%)",
        },
        min: 60,
        max: 90,
      },
      y2: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Temperature (°C)",
        },
        min: 330,
        max: 360,
      },
    },
  }

  // Auxiliary engines data
  const auxiliaryEnginesData: ChartData<"line"> = {
    labels: data.auxiliaryEngines.load.map((item) =>
      new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    ),
    datasets: [
      {
        label: "AE1 Load (%)",
        data: data.auxiliaryEngines.load.map((item) => item.engine1),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
      {
        label: "AE2 Load (%)",
        data: data.auxiliaryEngines.load.map((item) => item.engine2),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
      },
      {
        label: "AE3 Load (%)",
        data: data.auxiliaryEngines.load.map((item) => item.engine3),
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.5)",
      },
    ],
  }

  const auxiliaryEnginesOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Auxiliary Engines Load",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Load (%)",
        },
        min: 0,
        max: 100,
      },
    },
  }

  // Get status badge color
  const getMaintenanceStatusColor = (nextDue: string) => {
    const today = new Date()
    const due = new Date(nextDue)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "bg-red-500"
    if (diffDays < 30) return "bg-amber-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Engine Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="main">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="main">Main Engine</TabsTrigger>
              <TabsTrigger value="auxiliary">Auxiliary Engines</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="main" className="pt-4">
              <div className="h-[400px]">
                <Line options={mainEngineOptions} data={mainEngineData} />
              </div>
            </TabsContent>

            <TabsContent value="auxiliary" className="pt-4">
              <div className="h-[400px]">
                <Line options={auxiliaryEnginesOptions} data={auxiliaryEnginesData} />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                {data.auxiliaryEngines.runningHours.map((engine) => (
                  <Card key={engine.engine} className="bg-muted/50">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{engine.engine}</h3>
                      <p className="text-2xl font-bold">{engine.hours.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Running Hours</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Last Maintenance</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Running Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.maintenance.map((item) => {
                    const today = new Date()
                    const due = new Date(item.nextDue)
                    const diffTime = due.getTime() - today.getTime()
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                    return (
                      <TableRow key={item.component}>
                        <TableCell className="font-medium">{item.component}</TableCell>
                        <TableCell>{new Date(item.lastMaintenance).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(item.nextDue).toLocaleDateString()}</TableCell>
                        <TableCell>{item.runningHours.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getMaintenanceStatusColor(item.nextDue)}>
                            {diffDays < 0 ? (
                              <>
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Overdue
                              </>
                            ) : diffDays < 30 ? (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Due Soon
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                On Schedule
                              </>
                            )}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
