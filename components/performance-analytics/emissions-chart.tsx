"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

type EmissionsChartProps = {
  data: {
    co2: Array<{
      date: string
      value: number
    }>
    sox: Array<{
      date: string
      value: number
    }>
    nox: Array<{
      date: string
      value: number
    }>
    eedi: {
      attained: number
      required: number
      reference: number
    }
    cii: {
      value: number
      rating: string
      previousYear: number
      target: number
    }
  }
}

export function EmissionsChart({ data }: EmissionsChartProps) {
  // Daily emissions data
  const dailyEmissionsData: ChartData<"line"> = {
    labels: data.co2.map((item) => new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })),
    datasets: [
      {
        label: "CO₂ (tons/day)",
        data: data.co2.map((item) => item.value),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        yAxisID: "y",
      },
      {
        label: "SOₓ (tons/day)",
        data: data.sox.map((item) => item.value),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        yAxisID: "y1",
      },
      {
        label: "NOₓ (tons/day)",
        data: data.nox.map((item) => item.value),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        yAxisID: "y1",
      },
    ],
  }

  const dailyEmissionsOptions: ChartOptions<"line"> = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Daily Emissions",
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "CO₂ (tons/day)",
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
          text: "SOₓ/NOₓ (tons/day)",
        },
      },
    },
  }

  // EEDI data
  const eediData: ChartData<"bar"> = {
    labels: ["EEDI Values"],
    datasets: [
      {
        label: "Attained EEDI",
        data: [data.eedi.attained],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
      {
        label: "Required EEDI",
        data: [data.eedi.required],
        backgroundColor: "rgba(16, 185, 129, 0.7)",
      },
      {
        label: "Reference Line",
        data: [data.eedi.reference],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
      },
    ],
  }

  const eediOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Energy Efficiency Design Index (EEDI)",
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "EEDI Value (g CO₂/ton-nm)",
        },
        min: 0,
      },
    },
  }

  // CII data
  const ciiData: ChartData<"doughnut"> = {
    labels: ["A", "B", "C", "D", "E"],
    datasets: [
      {
        data: [20, 20, 20, 20, 20],
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)", // A - Green
          "rgba(59, 130, 246, 0.7)", // B - Blue
          "rgba(250, 204, 21, 0.7)", // C - Yellow
          "rgba(245, 158, 11, 0.7)", // D - Amber
          "rgba(239, 68, 68, 0.7)", // E - Red
        ],
        borderWidth: 1,
      },
    ],
  }

  const ciiOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Carbon Intensity Indicator (CII) Rating",
      },
      legend: {
        position: "top" as const,
      },
    },
  }

  // Get CII rating color
  const getCIIRatingColor = (rating: string) => {
    switch (rating) {
      case "A":
        return "bg-green-500"
      case "B":
        return "bg-blue-500"
      case "C":
        return "bg-yellow-500"
      case "D":
        return "bg-amber-500"
      case "E":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emissions Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily Emissions</TabsTrigger>
              <TabsTrigger value="eedi">EEDI</TabsTrigger>
              <TabsTrigger value="cii">CII Rating</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="pt-4">
              <div className="h-[400px]">
                <Line options={dailyEmissionsOptions} data={dailyEmissionsData} />
              </div>
            </TabsContent>

            <TabsContent value="eedi" className="pt-4">
              <div className="h-[400px]">
                <Bar options={eediOptions} data={eediData} />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Attained EEDI</h3>
                    <p className="text-2xl font-bold">{data.eedi.attained.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">g CO₂/ton-nm</p>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Required EEDI</h3>
                    <p className="text-2xl font-bold">{data.eedi.required.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">g CO₂/ton-nm</p>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Improvement</h3>
                    <p className="text-2xl font-bold">
                      {((1 - data.eedi.attained / data.eedi.reference) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">vs. Reference Line</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cii" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px] flex items-center justify-center">
                  <Doughnut options={ciiOptions} data={ciiData} />
                </div>

                <div className="flex flex-col justify-center">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Current CII Rating</h3>
                      <div className="flex items-center">
                        <Badge className={`text-2xl px-4 py-2 ${getCIIRatingColor(data.cii.rating)}`}>
                          {data.cii.rating}
                        </Badge>
                        <span className="ml-3 text-lg">{data.cii.value.toFixed(1)} g CO₂/ton-nm</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Previous Year</h3>
                      <p className="text-lg">{data.cii.previousYear.toFixed(1)} g CO₂/ton-nm</p>
                      <p className="text-sm text-muted-foreground">
                        {((1 - data.cii.value / data.cii.previousYear) * 100).toFixed(1)}% improvement
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Target</h3>
                      <p className="text-lg">{data.cii.target.toFixed(1)} g CO₂/ton-nm</p>
                      <p className="text-sm text-muted-foreground">
                        {(((data.cii.value - data.cii.target) / data.cii.target) * 100).toFixed(1)}% from target
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
