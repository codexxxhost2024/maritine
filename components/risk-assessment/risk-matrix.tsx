"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type RiskFactor = {
  id: string
  name: string
  category: string
  likelihood: number
  impact: number
  score: number
  level: "low" | "medium" | "high" | "critical"
  description: string
}

type RiskMatrixProps = {
  riskFactors: RiskFactor[]
}

export function RiskMatrix({ riskFactors }: RiskMatrixProps) {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  // Group risk factors by category
  const categorizedRisks: Record<string, RiskFactor[]> = {}
  riskFactors.forEach((factor) => {
    if (!categorizedRisks[factor.category]) {
      categorizedRisks[factor.category] = []
    }
    categorizedRisks[factor.category].push(factor)
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Risk Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-6 gap-1 mb-1">
                <div className="col-span-1"></div>
                <div className="col-span-5 grid grid-cols-5 gap-1">
                  <div className="text-center text-sm font-medium">1</div>
                  <div className="text-center text-sm font-medium">2</div>
                  <div className="text-center text-sm font-medium">3</div>
                  <div className="text-center text-sm font-medium">4</div>
                  <div className="text-center text-sm font-medium">5</div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-1">
                <div className="col-span-1 flex items-center">
                  <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium">Impact</div>
                </div>

                <div className="col-span-5 grid grid-cols-5 gap-1">
                  {/* Row 5 (highest impact) */}
                  {[5, 4, 3, 2, 1].map((impact) => (
                    <React.Fragment key={`row-${impact}`}>
                      {[1, 2, 3, 4, 5].map((likelihood) => {
                        const cellRiskFactors = riskFactors.filter(
                          (factor) => factor.impact === impact && factor.likelihood === likelihood,
                        )

                        let cellColor = "bg-green-100"
                        if (impact * likelihood >= 15) {
                          cellColor = "bg-red-100"
                        } else if (impact * likelihood >= 10) {
                          cellColor = "bg-orange-100"
                        } else if (impact * likelihood >= 5) {
                          cellColor = "bg-yellow-100"
                        }

                        return (
                          <div
                            key={`cell-${impact}-${likelihood}`}
                            className={`h-16 ${cellColor} rounded-md flex items-center justify-center relative`}
                          >
                            {cellRiskFactors.length > 0 ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="w-full h-full flex items-center justify-center cursor-pointer">
                                      <div className="flex flex-wrap gap-1 justify-center">
                                        {cellRiskFactors.map((factor) => (
                                          <Badge key={factor.id} className={getRiskLevelColor(factor.level)}>
                                            {factor.id.charAt(0).toUpperCase()}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <div className="space-y-2">
                                      {cellRiskFactors.map((factor) => (
                                        <div key={factor.id}>
                                          <div className="font-medium">{factor.name}</div>
                                          <div className="text-xs">{factor.description}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <span className="text-xs text-muted-foreground">{impact * likelihood}</span>
                            )}
                          </div>
                        )
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-6 gap-1 mt-1">
                <div className="col-span-1"></div>
                <div className="col-span-5 text-center text-sm font-medium">Likelihood</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk Factor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Likelihood</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskFactors
                .sort((a, b) => b.score - a.score)
                .map((factor) => (
                  <TableRow key={factor.id}>
                    <TableCell className="font-medium">{factor.name}</TableCell>
                    <TableCell>{factor.category}</TableCell>
                    <TableCell>{factor.likelihood} / 5</TableCell>
                    <TableCell>{factor.impact} / 5</TableCell>
                    <TableCell>
                      <Badge className={getRiskLevelColor(factor.level)}>{factor.level.toUpperCase()}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {Object.entries(categorizedRisks).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(categorizedRisks).map(([category, factors]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-lg font-medium">{category}</h3>
                  {factors.map((factor) => (
                    <div key={factor.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{factor.name}</span>
                        <Badge className={getRiskLevelColor(factor.level)}>{factor.level.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{factor.description}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
