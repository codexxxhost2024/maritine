"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Target } from "lucide-react"

type PerformanceMetricsProps = {
  metrics: {
    fuelEfficiency: {
      value: number
      unit: string
      change: number
      target: number
    }
    co2Emissions: {
      value: number
      unit: string
      change: number
      target: number
    }
    engineLoad: {
      value: number
      unit: string
      change: number
      target: number
    }
    speedEfficiency: {
      value: number
      unit: string
      change: number
      target: number
    }
  }
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard
        title="Fuel Efficiency"
        value={metrics.fuelEfficiency.value}
        unit={metrics.fuelEfficiency.unit}
        change={metrics.fuelEfficiency.change}
        target={metrics.fuelEfficiency.target}
        isLowerBetter={true}
        color="blue"
      />

      <MetricCard
        title="CO₂ Emissions"
        value={metrics.co2Emissions.value}
        unit={metrics.co2Emissions.unit}
        change={metrics.co2Emissions.change}
        target={metrics.co2Emissions.target}
        isLowerBetter={true}
        color="green"
      />

      <MetricCard
        title="Engine Load"
        value={metrics.engineLoad.value}
        unit={metrics.engineLoad.unit}
        change={metrics.engineLoad.change}
        target={metrics.engineLoad.target}
        isLowerBetter={false}
        color="amber"
      />

      <MetricCard
        title="Speed Efficiency"
        value={metrics.speedEfficiency.value}
        unit={metrics.speedEfficiency.unit}
        change={metrics.speedEfficiency.change}
        target={metrics.speedEfficiency.target}
        isLowerBetter={false}
        color="purple"
      />
    </div>
  )
}

type MetricCardProps = {
  title: string
  value: number
  unit: string
  change: number
  target: number
  isLowerBetter: boolean
  color: "blue" | "green" | "amber" | "purple"
}

function MetricCard({ title, value, unit, change, target, isLowerBetter, color }: MetricCardProps) {
  const isPositiveChange = isLowerBetter ? change < 0 : change > 0
  const isOnTarget = isLowerBetter ? value <= target : value >= target

  const getColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-700"
      case "green":
        return "bg-green-100 text-green-700"
      case "amber":
        return "bg-amber-100 text-amber-700"
      case "purple":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">{title}</h3>
          <div className={`w-3 h-3 rounded-full ${isOnTarget ? "bg-green-500" : "bg-amber-500"}`}></div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold">{value.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">{unit}</p>
          </div>

          <div className="flex flex-col items-end">
            <div className={`flex items-center text-sm ${isPositiveChange ? "text-green-600" : "text-red-600"}`}>
              {isPositiveChange ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>

            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Target className="h-3 w-3 mr-1" />
              <span>Target: {target.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className={`mt-3 text-xs px-2 py-1 rounded-full inline-flex items-center ${getColorClass(color)}`}>
          {title === "Fuel Efficiency" && "vs. Industry Avg: -5.2%"}
          {title === "CO₂ Emissions" && "vs. IMO Target: -8.7%"}
          {title === "Engine Load" && "Optimal Range: 70-80%"}
          {title === "Speed Efficiency" && "vs. Design Speed: +4.2%"}
        </div>
      </CardContent>
    </Card>
  )
}
