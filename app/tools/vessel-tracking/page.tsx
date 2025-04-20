import { VesselTracking } from "@/components/vessel-tracking/vessel-tracking"

export default function VesselTrackingPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Maritime Vessel Tracking System</h1>
        <VesselTracking />
      </div>
    </main>
  )
}
