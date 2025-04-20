"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, FileText } from "lucide-react"

type ComplianceItem = {
  id: string
  category: string
  requirement: string
  status: string
  lastChecked: string
  nextDue: string
  notes: string
}

type ComplianceChecklistProps = {
  complianceItems: ComplianceItem[]
}

export function ComplianceChecklist({ complianceItems }: ComplianceChecklistProps) {
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "compliant":
        return "bg-green-500"
      case "attention required":
        return "bg-amber-500"
      case "non-compliant":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  // Group items by category
  const groupedItems: Record<string, ComplianceItem[]> = {}
  complianceItems.forEach((item) => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = []
    }
    groupedItems[item.category].push(item)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Compliance Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-lg font-medium mb-3">{category}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.requirement}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status === "Compliant" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(item.lastChecked).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(item.nextDue).toLocaleDateString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
