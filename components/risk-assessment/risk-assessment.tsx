"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertTriangle, ShieldAlert, Info } from "lucide-react"
import { RiskMatrix } from "@/components/risk-assessment/risk-matrix"
import { RiskMitigationPlan } from "@/components/risk-assessment/risk-mitigation-plan"

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

type RiskAssessmentData = {
  vesselInfo: {
    name: string
    type: string
    size: string
    crew: number
  }
  voyage: {
    origin: string
    destination: string
    date: string
    duration: number
  }
  riskFactors: RiskFactor[]
  overallRiskScore: number
  overallRiskLevel: "low" | "medium" | "high" | "critical"
  mitigationPlan: {
    recommendations: string[]
    priorityActions: string[]
    contingencyPlans: string[]
  }
  aiAnalysis: string
}

export function RiskAssessment() {
  const [vesselName, setVesselName] = useState("")
  const [vesselType, setVesselType] = useState("container")
  const [vesselSize, setVesselSize] = useState("medium")
  const [crewSize, setCrewSize] = useState("")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [voyageDuration, setVoyageDuration] = useState("")
  const [cargoType, setCargoType] = useState("")
  const [weatherConditions, setWeatherConditions] = useState("")
  const [selectedRiskFactors, setSelectedRiskFactors] = useState<string[]>([
    "weather",
    "navigation",
    "mechanical",
    "crew",
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assessmentData, setAssessmentData] = useState<RiskAssessmentData | null>(null)

  const riskFactorOptions = [
    { id: "weather", label: "Weather & Sea Conditions" },
    { id: "navigation", label: "Navigation Hazards" },
    { id: "mechanical", label: "Mechanical & Equipment Failures" },
    { id: "crew", label: "Crew Fatigue & Human Factors" },
    { id: "cargo", label: "Cargo-Related Risks" },
    { id: "security", label: "Security Threats" },
    { id: "environmental", label: "Environmental Hazards" },
    { id: "regulatory", label: "Regulatory Compliance" },
    { id: "communication", label: "Communication Failures" },
    { id: "medical", label: "Medical Emergencies" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!vesselName || !origin || !destination) {
      setError("Please enter vessel name, origin, and destination")
      return
    }

    if (selectedRiskFactors.length === 0) {
      setError("Please select at least one risk factor to assess")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/risk/assess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vessel: {
            name: vesselName,
            type: vesselType,
            size: vesselSize,
            crew: Number.parseInt(crewSize) || 0,
          },
          voyage: {
            origin,
            destination,
            departureDate,
            duration: Number.parseInt(voyageDuration) || 0,
            cargoType,
          },
          conditions: {
            weather: weatherConditions,
          },
          riskFactors: selectedRiskFactors,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setAssessmentData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Voyage Risk Assessment</CardTitle>
          <CardDescription>Enter voyage details to assess potential risks</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Vessel Information</h3>
                <div>
                  <Label htmlFor="vessel-name">Vessel Name</Label>
                  <Input
                    id="vessel-name"
                    placeholder="e.g., MV Oceanic Explorer"
                    value={vesselName}
                    onChange={(e) => setVesselName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vessel-type">Vessel Type</Label>
                    <Select value={vesselType} onValueChange={setVesselType}>
                      <SelectTrigger id="vessel-type">
                        <SelectValue placeholder="Select vessel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="container">Container Ship</SelectItem>
                        <SelectItem value="tanker">Tanker</SelectItem>
                        <SelectItem value="bulk">Bulk Carrier</SelectItem>
                        <SelectItem value="cruise">Cruise Ship</SelectItem>
                        <SelectItem value="fishing">Fishing Vessel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="vessel-size">Vessel Size</Label>
                    <Select value={vesselSize} onValueChange={setVesselSize}>
                      <SelectTrigger id="vessel-size">
                        <SelectValue placeholder="Select vessel size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="vlcc">VLCC/ULCC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="crew-size">Crew Size</Label>
                  <Input
                    id="crew-size"
                    type="number"
                    placeholder="Number of crew members"
                    value={crewSize}
                    onChange={(e) => setCrewSize(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cargo-type">Cargo Type (if applicable)</Label>
                  <Input
                    id="cargo-type"
                    placeholder="e.g., Containers, Oil, LNG, Vehicles"
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Voyage Details</h3>
                <div>
                  <Label htmlFor="origin">Origin Port</Label>
                  <Input
                    id="origin"
                    placeholder="e.g., Rotterdam, Netherlands"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="destination">Destination Port</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Singapore"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="departure-date">Departure Date</Label>
                    <Input
                      id="departure-date"
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="voyage-duration">Duration (days)</Label>
                    <Input
                      id="voyage-duration"
                      type="number"
                      placeholder="Estimated days"
                      value={voyageDuration}
                      onChange={(e) => setVoyageDuration(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="weather-conditions">Expected Weather Conditions</Label>
                  <Textarea
                    id="weather-conditions"
                    placeholder="Describe expected weather and sea conditions"
                    value={weatherConditions}
                    onChange={(e) => setWeatherConditions(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Risk Factors to Assess</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {riskFactorOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`risk-${option.id}`}
                      checked={selectedRiskFactors.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRiskFactors([...selectedRiskFactors, option.id])
                        } else {
                          setSelectedRiskFactors(selectedRiskFactors.filter((id) => id !== option.id))
                        }
                      }}
                    />
                    <Label htmlFor={`risk-${option.id}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Risks...
                </>
              ) : (
                "Assess Voyage Risks"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {assessmentData && (
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Risk Summary</TabsTrigger>
            <TabsTrigger value="factors">Risk Factors</TabsTrigger>
            <TabsTrigger value="mitigation">Mitigation Plan</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Voyage Risk Summary</CardTitle>
                <CardDescription>
                  {assessmentData.vesselInfo.name}: {assessmentData.voyage.origin} to{" "}
                  {assessmentData.voyage.destination}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Overall Risk Level</h3>
                  <Badge
                    className={`${getRiskLevelColor(assessmentData.overallRiskLevel)} text-white px-4 py-1 text-lg`}
                  >
                    {assessmentData.overallRiskLevel.toUpperCase()}
                  </Badge>
                  <div className="w-full mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Low Risk</span>
                      <span>Critical Risk</span>
                    </div>
                    <Progress value={assessmentData.overallRiskScore} className="h-3" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Vessel Information</h3>
                    <dl className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">Name:</dt>
                      <dd>{assessmentData.vesselInfo.name}</dd>
                      <dt className="text-sm font-medium text-muted-foreground">Type:</dt>
                      <dd>{assessmentData.vesselInfo.type}</dd>
                      <dt className="text-sm font-medium text-muted-foreground">Size:</dt>
                      <dd>{assessmentData.vesselInfo.size}</dd>
                      <dt className="text-sm font-medium text-muted-foreground">Crew:</dt>
                      <dd>{assessmentData.vesselInfo.crew}</dd>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Voyage Details</h3>
                    <dl className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">Origin:</dt>
                      <dd>{assessmentData.voyage.origin}</dd>
                      <dt className="text-sm font-medium text-muted-foreground">Destination:</dt>
                      <dd>{assessmentData.voyage.destination}</dd>
                      <dt className="text-sm font-medium text-muted-foreground">Departure:</dt>
                      <dd>{assessmentData.voyage.date}</dd>
                      <dt className="text-sm font-medium text-muted-foreground">Duration:</dt>
                      <dd>{assessmentData.voyage.duration} days</dd>
                    </dl>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Top Risk Factors</h3>
                  <div className="space-y-3">
                    {assessmentData.riskFactors
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 3)
                      .map((factor) => (
                        <div key={factor.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center">
                            <ShieldAlert
                              className={`h-5 w-5 mr-2 ${factor.level === "critical" || factor.level === "high" ? "text-red-500" : "text-yellow-500"}`}
                            />
                            <span className="font-medium">{factor.name}</span>
                          </div>
                          <Badge className={getRiskLevelColor(factor.level)}>{factor.level.toUpperCase()}</Badge>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-start">
                  <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Priority Action Required</p>
                    <p className="mt-1">{assessmentData.mitigationPlan.priorityActions[0]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="factors">
            <RiskMatrix riskFactors={assessmentData.riskFactors} />
          </TabsContent>

          <TabsContent value="mitigation">
            <RiskMitigationPlan plan={assessmentData.mitigationPlan} />
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>AI Risk Analysis</CardTitle>
                <CardDescription>Powered by Gemini 2.0 Flash</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {assessmentData.aiAnalysis.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
