import { SafetyCompliance } from "@/components/safety-compliance/safety-compliance"

export default function SafetyCompliancePage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Maritime Safety Compliance</h1>
        <SafetyCompliance />
      </div>
    </main>
  )
}
