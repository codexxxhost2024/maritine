"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Users, Calendar } from "lucide-react"

type Drill = {
  id: string
  type: string
  date: string
  participants: number
  location: string
  scenario: string
  outcome: string
  notes: string
}

type DrillsLogProps = {
  drills: Drill[]
}

export function DrillsLog({ drills }: DrillsLogProps) {
  // Get outcome badge color
  const getOutcomeColor = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case "completed successfully":
        return "bg-green-500"
      case "completed with issues":
        return "bg-amber-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  // Group drills by type
  const drillsByType: Record<string, Drill[]> = {}
  drills.forEach((drill) => {
    if (!drillsByType[drill.type]) {
      drillsByType[drill.type] = []
    }
    drillsByType[drill.type].push(drill)
  })

  // Sort drills by date (newest first)
  const sortedDrills = [...drills].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Safety Drills Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scenario</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDrills.map((drill) => (
                <TableRow key={drill.id}>
                  <TableCell>{new Date(drill.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{drill.type}</TableCell>
                  <TableCell>{drill.scenario}</TableCell>
                  <TableCell>{drill.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      {drill.participants}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getOutcomeColor(drill.outcome)}>
                      {drill.outcome === "Completed Successfully" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {drill.outcome}
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
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Drill Participation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(drillsByType).map(([type, drills]) => (
              <Card key={type} className="bg-muted/50">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{type}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last conducted:</span>
                      <span>{new Date(drills[0].date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span>Monthly</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next due:</span>
                      <span>{getNextDueDate(drills[0].date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Success rate:</span>
                      <span>{calculateSuccessRate(drills)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to calculate next due date (1 month after last drill)
function getNextDueDate(lastDate: string): string {
  const date = new Date(lastDate)
  date.setMonth(date.getMonth() + 1)
  return date.toLocaleDateString()
}

// Helper function to calculate success rate
function calculateSuccessRate(drills: Drill[]): number {
  const successful = drills.filter((drill) => drill.outcome === "Completed Successfully").length
  return Math.round((successful / drills.length) * 100)
}
