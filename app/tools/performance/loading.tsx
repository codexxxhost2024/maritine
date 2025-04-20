import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Vessel Performance Analytics</h1>
        <div className="flex items-center justify-center h-[500px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Loading performance data...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
