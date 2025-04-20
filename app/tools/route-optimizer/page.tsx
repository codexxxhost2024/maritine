import { RouteOptimizer } from "@/components/route-optimizer/route-optimizer"

export default function RouteOptimizerPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Maritime Route Optimization Engine</h1>
        <RouteOptimizer />
      </div>
    </main>
  )
}
