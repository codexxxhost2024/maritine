import { PerformanceAnalytics } from "@/components/performance-analytics/performance-analytics"

export default function PerformanceAnalyticsPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Vessel Performance Analytics</h1>
        <PerformanceAnalytics />
      </div>
    </main>
  )
}
