"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Anchor, AlertTriangle, HelpCircle, BookOpen, Compass } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  category?: "navigation" | "regulations" | "emergency" | "weather" | "general"
}

type ChatCategory = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

export function MaritimeChatbot() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to the Maritime Assistant. How can I help you with navigation, regulations, or emergency procedures today?",
      timestamp: new Date(),
      category: "general",
    },
  ])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const categories: ChatCategory[] = [
    {
      id: "navigation",
      name: "Navigation",
      description: "Route planning, charts, and navigation tools",
      icon: <Compass className="h-5 w-5" />,
    },
    {
      id: "regulations",
      name: "Regulations",
      description: "Maritime laws, COLREGS, and compliance",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: "emergency",
      name: "Emergency",
      description: "Emergency procedures and safety protocols",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      id: "general",
      name: "General",
      description: "Other maritime questions and assistance",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      // For demo purposes, we'll simulate a response
      // In a real app, this would be an API call
      setTimeout(() => {
        const category = determineCategory(input)
        const response = generateResponse(input, category)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
          category,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setLoading(false)
      }, 1000)
    } catch (err) {
      console.error("Error sending message:", err)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        category: "general",
      }

      setMessages((prev) => [...prev, errorMessage])
      setLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)

    // Submit the form programmatically
    const form = document.getElementById("chat-form") as HTMLFormElement
    if (form) {
      form.dispatchEvent(new Event("submit", { cancelable: true }))
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Get category badge color
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "navigation":
        return "bg-blue-500"
      case "regulations":
        return "bg-purple-500"
      case "emergency":
        return "bg-red-500"
      case "weather":
        return "bg-green-500"
      default:
        return "bg-slate-500"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-3">
        <Card className="h-[700px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Anchor className="h-6 w-6 mr-2" />
              Maritime Assistant
            </CardTitle>
            <CardDescription>Ask questions about navigation, regulations, or emergency procedures</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div className="flex gap-3 max-w-[80%]">
                    {message.role === "assistant" && (
                      <Avatar>
                        <AvatarImage src="/assistant-avatar.png" alt="Assistant" />
                        <AvatarFallback>MA</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.role === "assistant" ? "Maritime Assistant" : "You"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {message.category && message.role === "assistant" && (
                          <Badge className={getCategoryColor(message.category)}>
                            {message.category.charAt(0).toUpperCase() + message.category.slice(1)}
                          </Badge>
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {message.content.split("\n").map((paragraph, i) => (
                          <p key={i} className={i > 0 ? "mt-2" : ""}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <form id="chat-form" onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-grow"
              />
              <Button type="submit" size="icon" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card className="h-[700px] flex flex-col">
          <CardHeader>
            <CardTitle>Quick Questions</CardTitle>
            <CardDescription>Common maritime inquiries</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <Tabs defaultValue="navigation">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="navigation">Navigation</TabsTrigger>
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
              </TabsList>

              <TabsContent value="navigation" className="space-y-4 mt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleQuickQuestion("What are the COLREGS rules for crossing situations?")}
                >
                  <Compass className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>COLREGS crossing rules</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleQuickQuestion("How do I calculate estimated time of arrival (ETA)?")}
                >
                  <Compass className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Calculating ETA</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleQuickQuestion("What are the navigation lights for a vessel under way?")}
                >
                  <Compass className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Navigation lights</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleQuickQuestion("How do I read a nautical chart?")}
                >
                  <Compass className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Reading nautical charts</span>
                </Button>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-4 mt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleQuickQuestion("What is the procedure for man overboard?")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Man overboard procedure</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleQuickQuestion("What are the emergency signals for a vessel in distress?")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Distress signals</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleQuickQuestion("How do I respond to a fire on board?")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Fire response</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleQuickQuestion("What are the GMDSS emergency procedures?")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>GMDSS procedures</span>
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium">Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <Card key={category.id} className="p-3">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        {category.icon}
                      </div>
                      <h4 className="text-sm font-medium">{category.name}</h4>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper functions for the demo
function determineCategory(message: string): "navigation" | "regulations" | "emergency" | "weather" | "general" {
  const lowerMessage = message.toLowerCase()

  if (
    lowerMessage.includes("route") ||
    lowerMessage.includes("chart") ||
    lowerMessage.includes("navigation") ||
    lowerMessage.includes("compass") ||
    lowerMessage.includes("bearing") ||
    lowerMessage.includes("course")
  ) {
    return "navigation"
  }

  if (
    lowerMessage.includes("regulation") ||
    lowerMessage.includes("law") ||
    lowerMessage.includes("rule") ||
    lowerMessage.includes("colreg") ||
    lowerMessage.includes("solas") ||
    lowerMessage.includes("marpol")
  ) {
    return "regulations"
  }

  if (
    lowerMessage.includes("emergency") ||
    lowerMessage.includes("distress") ||
    lowerMessage.includes("mayday") ||
    lowerMessage.includes("fire") ||
    lowerMessage.includes("collision") ||
    lowerMessage.includes("abandon")
  ) {
    return "emergency"
  }

  if (
    lowerMessage.includes("weather") ||
    lowerMessage.includes("forecast") ||
    lowerMessage.includes("storm") ||
    lowerMessage.includes("wind") ||
    lowerMessage.includes("wave") ||
    lowerMessage.includes("sea state")
  ) {
    return "weather"
  }

  return "general"
}

function generateResponse(message: string, category: string): string {
  // Simple response generation for demo purposes
  const responses: Record<string, string[]> = {
    navigation: [
      "In a crossing situation, the vessel which has the other on its starboard side must give way. The give-way vessel should take early and substantial action to keep well clear.",
      "To calculate ETA, divide the remaining distance by your vessel's speed. For example, if you have 100 nautical miles to go and your speed is 10 knots, your ETA would be 10 hours from now.",
      "Nautical charts use symbols and colors to represent depths, hazards, aids to navigation, and other important information. Always check the chart datum, scale, and date of the last correction.",
    ],
    regulations: [
      "COLREGS (International Regulations for Preventing Collisions at Sea) consist of 38 rules divided into five parts covering steering, lights, sound signals, and more.",
      "SOLAS (Safety of Life at Sea) is the most important international treaty concerning the safety of merchant ships, specifying minimum standards for construction, equipment, and operation.",
      "MARPOL (International Convention for the Prevention of Pollution from Ships) has six annexes covering oil, noxious substances, harmful substances, sewage, garbage, and air pollution.",
    ],
    emergency: [
      "In case of man overboard: 1) Shout 'Man overboard' and throw a lifebuoy, 2) Assign a crewmember to maintain visual contact, 3) Activate MOB on GPS, 4) Execute a recovery maneuver.",
      "Maritime distress signals include: Mayday calls on VHF Channel 16, DSC distress alerts, EPIRB activation, red flares or rockets, orange smoke signals, and SOS using light or sound.",
      "In case of fire onboard: 1) Raise the alarm, 2) Contain the fire by closing doors/hatches, 3) Cut off fuel/electrical supply to the area, 4) Fight the fire if safe to do so.",
    ],
    weather: [
      "The Beaufort Scale measures wind force from 0 (calm, less than 1 knot) to 12 (hurricane, 64+ knots). Each level describes sea conditions and observable effects.",
      "Weather routing uses meteorological forecasts to determine the optimal route that minimizes voyage time while avoiding hazardous conditions.",
      "Tropical cyclones (hurricanes, typhoons) are intense low-pressure systems with winds exceeding 64 knots. Vessels should avoid the dangerous semicircle.",
    ],
    general: [
      "I'm the Maritime Assistant, designed to help with navigation, regulations, weather, and emergency procedures. How can I assist you today?",
      "Maritime safety is paramount. Always ensure proper lookout, maintain safe speed, and follow all applicable regulations.",
      "Regular training and drills are essential for maintaining safety at sea. Ensure all crew members are familiar with emergency procedures.",
    ],
  }

  const categoryResponses = responses[category] || responses.general
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
}
