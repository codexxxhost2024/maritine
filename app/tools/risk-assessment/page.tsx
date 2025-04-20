import { RiskAssessment } from "@/components/risk-assessment/risk-assessment"

export default function RiskAssessmentPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dynamic Risk Assessment & Mitigation Tool</h1>
        <RiskAssessment />
      </div>
    </main>
  )
}
