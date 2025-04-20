"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react"

type MitigationPlan = {
  recommendations: string[]
  priorityActions: string[]
  contingencyPlans: string[]
}

type RiskMitigationPlanProps = {
  plan: MitigationPlan
}

export function RiskMitigationPlan({ plan }: RiskMitigationPlanProps) {
  return (
    <Tabs defaultValue="priority" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="priority">Priority Actions</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        <TabsTrigger value="contingency">Contingency Plans</TabsTrigger>
      </TabsList>

      <TabsContent value="priority">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Priority Actions
            </CardTitle>
            <CardDescription>Critical actions that should be taken before or during the voyage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plan.priorityActions.map((action, index) => (
                <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p>{action}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="recommendations">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Recommendations
            </CardTitle>
            <CardDescription>General recommendations to reduce risk and improve safety</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plan.recommendations.map((recommendation, index) => (
                <div key={index} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-600 flex-shrink-0 mt-0.5" />
                    <p>{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contingency">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-blue-500" />
              Contingency Plans
            </CardTitle>
            <CardDescription>Plans to implement if identified risks materialize</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plan.contingencyPlans.map((plan, index) => (
                <div key={index} className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <ShieldCheck className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p>{plan}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
