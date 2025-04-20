"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Compass, Navigation, Anchor, Wind } from "lucide-react"
import { useEffect, useRef } from "react"

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
  alerts: any[]
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

type NavigationInstrumentsProps = {
  navigationData: NavigationData
}

export function NavigationInstruments({ navigationData }: NavigationInstrumentsProps) {
  const compassCanvasRef = useRef<HTMLCanvasElement>(null)
  const windCanvasRef = useRef<HTMLCanvasElement>(null)

  // Draw compass
  useEffect(() => {
    const canvas = compassCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw compass circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = "#f8fafc"
    ctx.fill()
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw cardinal points
    const cardinalPoints = ["N", "E", "S", "W"]
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#0f172a"

    cardinalPoints.forEach((point, index) => {
      const angle = (index * 90 * Math.PI) / 180
      const x = centerX + (radius - 25) * Math.sin(angle)
      const y = centerY - (radius - 25) * Math.cos(angle)
      ctx.fillText(point, x, y)
    })

    // Draw degree markers
    ctx.lineWidth = 1
    for (let i = 0; i < 360; i += 10) {
      const angle = (i * Math.PI) / 180
      const startRadius = i % 30 === 0 ? radius - 15 : radius - 10
      const x1 = centerX + startRadius * Math.sin(angle)
      const y1 = centerY - startRadius * Math.cos(angle)
      const x2 = centerX + radius * Math.sin(angle)
      const y2 = centerY - radius * Math.cos(angle)

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()

      if (i % 30 === 0 && i !== 0 && i !== 90 && i !== 180 && i !== 270) {
        const textX = centerX + (radius - 30) * Math.sin(angle)
        const textY = centerY - (radius - 30) * Math.cos(angle)
        ctx.font = "12px Arial"
        ctx.fillText(i.toString(), textX, textY)
      }
    }

    // Draw heading indicator
    const headingAngle = (navigationData.heading * Math.PI) / 180
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + radius * 0.8 * Math.sin(headingAngle), centerY - radius * 0.8 * Math.cos(headingAngle))
    ctx.strokeStyle = "#0070f3"
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw course indicator
    const courseAngle = (navigationData.course * Math.PI) / 180
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + radius * 0.7 * Math.sin(courseAngle), centerY - radius * 0.7 * Math.cos(courseAngle))
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw center dot
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI)
    ctx.fillStyle = "#0f172a"
    ctx.fill()

    // Add labels
    ctx.font = "14px Arial"
    ctx.fillStyle = "#0070f3"
    ctx.fillText(`Heading: ${navigationData.heading}°`, centerX, centerY + radius + 20)
    ctx.fillStyle = "#ef4444"
    ctx.fillText(`Course: ${navigationData.course}°`, centerX, centerY + radius + 40)
  }, [navigationData])

  // Draw wind indicator
  useEffect(() => {
    const canvas = windCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw wind circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = "#f8fafc"
    ctx.fill()
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw cardinal points
    const cardinalPoints = ["N", "E", "S", "W"]
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#0f172a"

    cardinalPoints.forEach((point, index) => {
      const angle = (index * 90 * Math.PI) / 180
      const x = centerX + (radius - 25) * Math.sin(angle)
      const y = centerY - (radius - 25) * Math.cos(angle)
      ctx.fillText(point, x, y)
    })

    // Draw wind direction arrow
    const windAngle = (navigationData.wind.direction * Math.PI) / 180

    // Arrow shaft
    ctx.beginPath()
    ctx.moveTo(centerX - radius * 0.7 * Math.sin(windAngle), centerY + radius * 0.7 * Math.cos(windAngle))
    ctx.lineTo(centerX + radius * 0.7 * Math.sin(windAngle), centerY - radius * 0.7 * Math.cos(windAngle))
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 3
    ctx.stroke()

    // Arrow head
    const headLength = 20
    const headAngle = Math.PI / 6 // 30 degrees

    const x2 = centerX + radius * 0.7 * Math.sin(windAngle)
    const y2 = centerY - radius * 0.7 * Math.cos(windAngle)

    ctx.beginPath()
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - headLength * Math.cos(windAngle - headAngle), y2 - headLength * Math.sin(windAngle - headAngle))
    ctx.lineTo(x2 - headLength * Math.cos(windAngle + headAngle), y2 - headLength * Math.sin(windAngle + headAngle))
    ctx.closePath()
    ctx.fillStyle = "#10b981"
    ctx.fill()

    // Add wind speed label
    ctx.font = "14px Arial"
    ctx.fillStyle = "#10b981"
    ctx.fillText(`Wind: ${navigationData.wind.speed} knots`, centerX, centerY + radius + 20)
    ctx.fillText(`Direction: ${navigationData.wind.direction}°`, centerX, centerY + radius + 40)
  }, [navigationData])

  return (
    <Tabs defaultValue="compass" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="compass">Compass</TabsTrigger>
        <TabsTrigger value="wind">Wind Indicator</TabsTrigger>
        <TabsTrigger value="depth">Depth Sounder</TabsTrigger>
      </TabsList>

      <TabsContent value="compass">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Compass className="h-5 w-5 mr-2" />
              Compass
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <canvas ref={compassCanvasRef} width={300} height={300} className="mb-4" />
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <Card className="bg-muted/50">
                <CardContent className="p-4 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Navigation className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Heading</p>
                    <p className="text-lg font-bold">{navigationData.heading}°</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="p-4 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <Navigation className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Course</p>
                    <p className="text-lg font-bold">{navigationData.course}°</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="wind">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wind className="h-5 w-5 mr-2" />
              Wind Indicator
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <canvas ref={windCanvasRef} width={300} height={300} className="mb-4" />
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <Card className="bg-muted/50">
                <CardContent className="p-4 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Wind className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Wind Speed</p>
                    <p className="text-lg font-bold">{navigationData.wind.speed} kts</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="p-4 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Navigation className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Direction</p>
                    <p className="text-lg font-bold">{navigationData.wind.direction}°</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="depth">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Anchor className="h-5 w-5 mr-2" />
              Depth Sounder
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-full max-w-md p-8 bg-muted/50 rounded-lg flex flex-col items-center mb-4">
              <p className="text-6xl font-bold mb-2">{navigationData.depth.toFixed(1)}</p>
              <p className="text-xl text-muted-foreground">meters</p>
            </div>

            <div className="w-full max-w-md">
              <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${navigationData.depth < 10 ? "bg-red-500" : navigationData.depth < 20 ? "bg-amber-500" : "bg-green-500"}`}
                  style={{ width: `${Math.min(100, (navigationData.depth / 50) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>0m</span>
                <span>25m</span>
                <span>50m+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
