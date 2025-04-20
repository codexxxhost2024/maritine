import { WeatherDashboard } from "@/components/weather-dashboard"

export default function WeatherPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Maritime Weather Dashboard</h1>
        <WeatherDashboard />
      </div>
    </main>
  )
}
