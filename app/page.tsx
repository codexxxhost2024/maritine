import Link from "next/link"
import { CloudRain, Route, MessageSquare, AlertTriangle, Anchor, Navigation, Shield, BarChart } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const tools = [
  {
    name: "Weather Dashboard",
    description: "Real-time maritime weather forecasting with AI-powered risk analysis",
    href: "/tools/weather",
    icon: CloudRain,
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Route Optimizer",
    description: "Optimize maritime routes based on weather, currents, and fuel efficiency",
    href: "/tools/route-optimizer",
    icon: Route,
    color: "bg-green-100 text-green-700",
  },
  {
    name: "Maritime Chatbot",
    description: "AI-powered assistant for navigation, regulations, and emergency procedures",
    href: "/tools/chatbot",
    icon: MessageSquare,
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Risk Assessment",
    description: "Dynamic risk assessment and mitigation planning for maritime operations",
    href: "/tools/risk-assessment",
    icon: AlertTriangle,
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Vessel Tracking",
    description: "Real-time AIS data visualization and vessel movement analytics",
    href: "/tools/vessel-tracking",
    icon: Anchor,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    name: "Navigation Assistant",
    description: "Enhanced navigation with AI-powered recommendations and alerts",
    href: "/tools/navigation",
    icon: Navigation,
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    name: "Safety Compliance",
    description: "Maritime safety compliance monitoring and documentation",
    href: "/tools/safety",
    icon: Shield,
    color: "bg-red-100 text-red-700",
  },
  {
    name: "Performance Analytics",
    description: "Vessel performance monitoring and efficiency optimization",
    href: "/tools/performance",
    icon: BarChart,
    color: "bg-emerald-100 text-emerald-700",
  },
]

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.name} href={tool.href} className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-[#003366]/30">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${tool.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-[#003366] group-hover:text-[#003366]/80 transition-colors">
                    {tool.name}
                  </CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <p className="text-sm text-[#003366] font-medium">Explore Tool →</p>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
