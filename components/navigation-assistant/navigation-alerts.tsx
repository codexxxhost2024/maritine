"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Navigation, MapPin, Clock } from "lucide-react"

type NavigationAlert = {
  id: string
  type: "collision" | "weather" | "shallow" | "traffic" | "restricted"
  title: string
  description: string
  position: {
    lat: number
    lng: number
  }
  distance: number
  severity: "low" | "medium" | "high"
  timestamp: string
}

type NavigationAlertsProps = {
  alerts: NavigationAlert[]
}

export function NavigationAlerts({ alerts }: NavigationAlertsProps) {
  // Get alert severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-slate-500"
    }
  }

  // Get alert type icon
  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "collision":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "weather":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "shallow":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />
      case "traffic":
        return <AlertTriangle className="h-5 w-5 text-purple-500" />
      case "restricted":
        return <AlertTriangle className="h-5 w-5 text-slate-500" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Navigation Alerts & Warnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No active alerts or warnings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="overflow-hidden">
                <div className={`h-1 ${getSeverityColor(alert.severity)}`} />
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getAlertTypeIcon(alert.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{alert.title}</h3>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>
                            {alert.position.lat.toFixed(4)}, {alert.position.lng.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Navigation className="h-3 w-3 mr-1" />
                          <span>{alert.distance.toFixed(1)} nm</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
