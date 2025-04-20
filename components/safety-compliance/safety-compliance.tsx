"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Ship } from "lucide-react"
import { ComplianceChecklist } from "@/components/safety-compliance/compliance-checklist"
import { CertificatesList } from "@/components/safety-compliance/certificates-list"
import { DrillsLog } from "@/components/safety-compliance/drills-log"

export function SafetyCompliance() {
  const [vesselName, setVesselName] = useState("")
  const [vesselType, setVesselType] = useState("container")
  const [flag, setFlag] = useState("")
  const [complianceData, setComplianceData] = useState(getMockComplianceData())

  const handleGenerateReport = () => {
    // In a real app, this would fetch data from an API
    // For this demo, we'll just update the mock data with the vessel name and type
    const updatedData = {
      ...getMockComplianceData(),
      vessel: {
        ...getMockComplianceData().vessel,
        name: vesselName || "Sample Vessel",
        type: vesselType,
        flag: flag || "Panama",
      },
    }
    setComplianceData(updatedData)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Safety Compliance Dashboard</CardTitle>
          <CardDescription>Monitor and manage maritime safety compliance requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="vessel-name">Vessel Name</Label>
                <Input
                  id="vessel-name"
                  placeholder="Enter vessel name"
                  value={vesselName}
                  onChange={(e) => setVesselName(e.target.value)}
                />
              </div>
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
                    <SelectItem value="passenger">Passenger Ship</SelectItem>
                    <SelectItem value="fishing">Fishing Vessel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="flag">Flag State</Label>
                <Input
                  id="flag"
                  placeholder="Enter flag state"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                />
              </div>
              <Button onClick={handleGenerateReport}>Generate Compliance Report</Button>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Ship className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">
                      {complianceData.vessel.name} ({complianceData.vessel.type})
                    </h3>
                  </div>
                  <Badge className={complianceData.overallStatus === "Compliant" ? "bg-green-500" : "bg-amber-500"}>
                    {complianceData.overallStatus}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Compliance Score</span>
                    <span className="font-medium">{complianceData.complianceScore}%</span>
                  </div>
                  <Progress value={complianceData.complianceScore} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Expiring Soon</p>
                        <p className="text-lg font-bold">{complianceData.expiringCertificates} certificates</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Next Inspection</p>
                        <p className="text-lg font-bold">{complianceData.nextInspection}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {complianceData && (
        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="checklist">Compliance Checklist</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="drills">Safety Drills</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist">
            <ComplianceChecklist complianceItems={complianceData.complianceItems} />
          </TabsContent>

          <TabsContent value="certificates">
            <CertificatesList certificates={complianceData.certificates} />
          </TabsContent>

          <TabsContent value="drills">
            <DrillsLog drills={complianceData.safetyDrills} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// Mock data generator
function getMockComplianceData() {
  return {
    vessel: {
      name: "Sample Vessel",
      type: "Container Ship",
      flag: "Panama",
      imo: "IMO9395044",
      callSign: "3FVN5",
      grossTonnage: 43000,
    },
    overallStatus: "Compliant",
    complianceScore: 92,
    expiringCertificates: 3,
    nextInspection: "2023-08-15",
    complianceItems: [
      {
        id: "item-1",
        category: "SOLAS",
        requirement: "Life-saving appliances and arrangements",
        status: "Compliant",
        lastChecked: "2023-05-10",
        nextDue: "2023-11-10",
        notes: "All life-saving equipment inspected and in good condition.",
      },
      {
        id: "item-2",
        category: "MARPOL",
        requirement: "Prevention of pollution by oil",
        status: "Compliant",
        lastChecked: "2023-04-22",
        nextDue: "2023-10-22",
        notes: "Oil filtering equipment functioning properly. Records up to date.",
      },
      {
        id: "item-3",
        category: "STCW",
        requirement: "Crew certification and training",
        status: "Compliant",
        lastChecked: "2023-06-05",
        nextDue: "2023-12-05",
        notes: "All crew members have valid certificates for their positions.",
      },
      {
        id: "item-4",
        category: "ISM Code",
        requirement: "Safety Management System",
        status: "Compliant",
        lastChecked: "2023-03-15",
        nextDue: "2023-09-15",
        notes: "SMS documentation up to date. Internal audit completed.",
      },
      {
        id: "item-5",
        category: "ISPS Code",
        requirement: "Ship Security Plan",
        status: "Compliant",
        lastChecked: "2023-05-20",
        nextDue: "2023-11-20",
        notes: "Security plan reviewed and approved. All security measures in place.",
      },
      {
        id: "item-6",
        category: "MLC",
        requirement: "Seafarer working and living conditions",
        status: "Attention Required",
        lastChecked: "2023-06-01",
        nextDue: "2023-12-01",
        notes: "Minor issues with crew accommodation need to be addressed.",
      },
      {
        id: "item-7",
        category: "COLREG",
        requirement: "Navigation lights and shapes",
        status: "Compliant",
        lastChecked: "2023-05-05",
        nextDue: "2023-11-05",
        notes: "All navigation lights functioning properly.",
      },
      {
        id: "item-8",
        category: "Ballast Water Management",
        requirement: "Ballast water treatment system",
        status: "Compliant",
        lastChecked: "2023-04-15",
        nextDue: "2023-10-15",
        notes: "Treatment system operational and records maintained.",
      },
    ],
    certificates: [
      {
        id: "cert-1",
        name: "Safety Management Certificate (SMC)",
        issueDate: "2021-07-15",
        expiryDate: "2026-07-14",
        issuingAuthority: "Panama Maritime Authority",
        status: "Valid",
      },
      {
        id: "cert-2",
        name: "International Ship Security Certificate (ISSC)",
        issueDate: "2021-08-10",
        expiryDate: "2026-08-09",
        issuingAuthority: "Panama Maritime Authority",
        status: "Valid",
      },
      {
        id: "cert-3",
        name: "International Oil Pollution Prevention Certificate (IOPPC)",
        issueDate: "2022-03-20",
        expiryDate: "2023-09-19",
        issuingAuthority: "ClassNK",
        status: "Expiring Soon",
      },
      {
        id: "cert-4",
        name: "Cargo Ship Safety Construction Certificate",
        issueDate: "2020-11-05",
        expiryDate: "2025-11-04",
        issuingAuthority: "ClassNK",
        status: "Valid",
      },
      {
        id: "cert-5",
        name: "Cargo Ship Safety Equipment Certificate",
        issueDate: "2022-05-12",
        expiryDate: "2023-11-11",
        issuingAuthority: "ClassNK",
        status: "Expiring Soon",
      },
      {
        id: "cert-6",
        name: "Cargo Ship Safety Radio Certificate",
        issueDate: "2022-05-12",
        expiryDate: "2023-11-11",
        issuingAuthority: "ClassNK",
        status: "Expiring Soon",
      },
      {
        id: "cert-7",
        name: "Maritime Labour Certificate",
        issueDate: "2021-09-30",
        expiryDate: "2026-09-29",
        issuingAuthority: "Panama Maritime Authority",
        status: "Valid",
      },
      {
        id: "cert-8",
        name: "International Air Pollution Prevention Certificate",
        issueDate: "2022-01-15",
        expiryDate: "2027-01-14",
        issuingAuthority: "ClassNK",
        status: "Valid",
      },
    ],
    safetyDrills: [
      {
        id: "drill-1",
        type: "Fire Drill",
        date: "2023-06-10",
        participants: 22,
        location: "Engine Room",
        scenario: "Engine room fire simulation",
        outcome: "Completed Successfully",
        notes: "Crew response time improved from previous drill.",
      },
      {
        id: "drill-2",
        type: "Abandon Ship Drill",
        date: "2023-05-25",
        participants: 25,
        location: "Muster Stations",
        scenario: "Vessel taking on water, abandon ship order given",
        outcome: "Completed Successfully",
        notes: "All crew accounted for within required time.",
      },
      {
        id: "drill-3",
        type: "Man Overboard Drill",
        date: "2023-05-15",
        participants: 18,
        location: "Port Side Main Deck",
        scenario: "Crew member fallen overboard during cargo operations",
        outcome: "Completed with Issues",
        notes: "Rescue boat deployment took longer than required. Additional training scheduled.",
      },
      {
        id: "drill-4",
        type: "Security Drill",
        date: "2023-04-30",
        participants: 15,
        location: "Ship's Bridge",
        scenario: "Unauthorized access attempt",
        outcome: "Completed Successfully",
        notes: "Security team responded according to procedures.",
      },
      {
        id: "drill-5",
        type: "Oil Spill Response Drill",
        date: "2023-04-20",
        participants: 12,
        location: "Main Deck",
        scenario: "Fuel oil spill during bunkering",
        outcome: "Completed Successfully",
        notes: "Containment equipment deployed correctly. Notification procedures followed.",
      },
      {
        id: "drill-6",
        type: "Enclosed Space Entry Drill",
        date: "2023-04-05",
        participants: 10,
        location: "Cargo Hold",
        scenario: "Rescue of unconscious person from enclosed space",
        outcome: "Completed Successfully",
        notes: "Proper use of breathing apparatus and rescue equipment demonstrated.",
      },
    ],
  }
}
