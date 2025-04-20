import { NextResponse } from "next/server"
import { generateText } from "ai"
import { GoogleGenerativeAI } from "@ai-sdk/google"

type Message = {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Determine the likely category of the question
    const category = determineCategory(message)

    // Generate the chatbot response using Gemini if available
    let response

    if (process.env.GEMINI_API_KEY) {
      try {
        response = await generateChatbotResponse(message, history)
      } catch (error) {
        console.error("Error generating response with Gemini:", error)
        response = generateFallbackResponse(message, category)
      }
    } else {
      response = generateFallbackResponse(message, category)
    }

    return NextResponse.json({
      response,
      category,
    })
  } catch (error) {
    console.error("Error in chatbot:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}

function determineCategory(message: string): "navigation" | "regulations" | "emergency" | "weather" | "general" {
  const lowerMessage = message.toLowerCase()

  // Check for navigation-related keywords
  if (
    lowerMessage.includes("route") ||
    lowerMessage.includes("chart") ||
    lowerMessage.includes("navigation") ||
    lowerMessage.includes("compass") ||
    lowerMessage.includes("bearing") ||
    lowerMessage.includes("course") ||
    lowerMessage.includes("heading") ||
    lowerMessage.includes("gps") ||
    lowerMessage.includes("position") ||
    lowerMessage.includes("waypoint") ||
    lowerMessage.includes("eta")
  ) {
    return "navigation"
  }

  // Check for regulation-related keywords
  if (
    lowerMessage.includes("regulation") ||
    lowerMessage.includes("law") ||
    lowerMessage.includes("rule") ||
    lowerMessage.includes("colreg") ||
    lowerMessage.includes("solas") ||
    lowerMessage.includes("marpol") ||
    lowerMessage.includes("imo") ||
    lowerMessage.includes("compliance") ||
    lowerMessage.includes("certificate") ||
    lowerMessage.includes("license") ||
    lowerMessage.includes("inspection")
  ) {
    return "regulations"
  }

  // Check for emergency-related keywords
  if (
    lowerMessage.includes("emergency") ||
    lowerMessage.includes("distress") ||
    lowerMessage.includes("mayday") ||
    lowerMessage.includes("sos") ||
    lowerMessage.includes("fire") ||
    lowerMessage.includes("collision") ||
    lowerMessage.includes("abandon") ||
    lowerMessage.includes("evacuation") ||
    lowerMessage.includes("overboard") ||
    lowerMessage.includes("rescue") ||
    lowerMessage.includes("safety")
  ) {
    return "emergency"
  }

  // Check for weather-related keywords
  if (
    lowerMessage.includes("weather") ||
    lowerMessage.includes("forecast") ||
    lowerMessage.includes("storm") ||
    lowerMessage.includes("wind") ||
    lowerMessage.includes("wave") ||
    lowerMessage.includes("sea state") ||
    lowerMessage.includes("visibility") ||
    lowerMessage.includes("fog") ||
    lowerMessage.includes("rain") ||
    lowerMessage.includes("hurricane") ||
    lowerMessage.includes("typhoon")
  ) {
    return "weather"
  }

  // Default to general
  return "general"
}

async function generateChatbotResponse(message: string, history: Message[]): Promise<string> {
  // Format the conversation history for the prompt
  const formattedHistory = history
    .map((msg) => `${msg.role === "user" ? "User" : "Maritime Assistant"}: ${msg.content}`)
    .join("\n\n")

  // Construct the prompt for Gemini
  const prompt = `
    You are a Maritime Assistant, an AI specialized in maritime knowledge, navigation, regulations, and emergency procedures. 
    You provide accurate, concise, and helpful information to maritime professionals.
    
    Previous conversation:
    ${formattedHistory}
    
    User's new message: ${message}
    
    Respond as the Maritime Assistant. Be informative, precise, and use proper maritime terminology. 
    If the question relates to emergency procedures, emphasize safety considerations.
    If the question is about navigation, provide clear and accurate guidance.
    If the question is about regulations, cite the relevant maritime laws or codes.
    If you don't know the answer, acknowledge that and suggest where the user might find the information.
    
    Format your response in clear paragraphs with appropriate line breaks. Keep your response concise but comprehensive.
  `

  // Use the AI SDK to generate text with Gemini
  const { text } = await generateText({
    model: GoogleGenerativeAI("gemini-pro"),
    prompt: prompt,
    maxTokens: 1024,
  })

  return text
}

function generateFallbackResponse(message: string, category: string): string {
  // Fallback responses when Gemini is not available
  const fallbackResponses = {
    navigation: {
      "colregs crossing rules":
        "In a crossing situation, the vessel which has the other on its starboard side must give way. The give-way vessel should take early and substantial action to keep well clear. The stand-on vessel should maintain its course and speed, but be prepared to take action if necessary.",
      "calculating eta":
        "To calculate ETA (Estimated Time of Arrival), divide the remaining distance by your vessel's speed. For example, if you have 100 nautical miles to go and your speed is 10 knots, your ETA would be 10 hours from now.",
      "navigation lights":
        "A power-driven vessel underway must show: a white masthead light forward, a second masthead light abaft of and higher than the forward one (for vessels over 50 meters), sidelights (green starboard, red port), and a white stern light.",
      "reading nautical charts":
        "Nautical charts use symbols and colors to represent depths, hazards, aids to navigation, and other important information. Depths are typically shown in meters or fathoms. Always check the chart datum, scale, and date of the last correction.",
    },
    emergency: {
      "man overboard procedure":
        "The immediate response to a man overboard situation is: 1) Shout 'Man overboard' and throw a lifebuoy, 2) Assign a crewmember to maintain visual contact, 3) Activate MOB on GPS, 4) Execute a Williamson turn or other recovery maneuver, 5) Prepare recovery equipment, 6) Alert nearby vessels and authorities if necessary.",
      "distress signals":
        "Maritime distress signals include: Mayday calls on VHF Channel 16, DSC distress alerts, EPIRB activation, red flares or rockets, orange smoke signals, SOS using light or sound, the distress flag (square flag with a ball above or below it), and raising and lowering outstretched arms.",
      "fire response":
        "In case of fire onboard: 1) Raise the alarm, 2) Contain the fire by closing doors/hatches, 3) Cut off fuel/electrical supply to the area, 4) Fight the fire if safe to do so using appropriate extinguishers, 5) Prepare lifesaving equipment if necessary, 6) Send distress signal if the fire cannot be controlled.",
      "gmdss procedures":
        "GMDSS emergency procedures include: 1) For distress, send a DSC alert followed by a Mayday call on the appropriate frequency, 2) For urgency, use Pan-Pan, 3) For safety, use Securite. Always include your vessel's identity, position, nature of distress, and assistance required.",
    },
    regulations: {
      colregs:
        "The International Regulations for Preventing Collisions at Sea (COLREGs) consist of 38 rules divided into five parts: Part A - General, Part B - Steering and Sailing, Part C - Lights and Shapes, Part D - Sound and Light Signals, and Part E - Exemptions.",
      marpol:
        "MARPOL (International Convention for the Prevention of Pollution from Ships) has six annexes covering: I - Oil, II - Noxious Liquid Substances, III - Harmful Substances in Packaged Form, IV - Sewage, V - Garbage, and VI - Air Pollution.",
      solas:
        "SOLAS (Safety of Life at Sea) is the most important international treaty concerning the safety of merchant ships. It specifies minimum standards for the construction, equipment, and operation of ships, compatible with their safety.",
    },
    weather: {
      "beaufort scale":
        "The Beaufort Scale measures wind force from 0 (calm, less than 1 knot) to 12 (hurricane, 64+ knots). Each level describes sea conditions and observable effects, helping mariners estimate wind speed visually.",
      "weather routing":
        "Weather routing uses meteorological forecasts to determine the optimal route that minimizes voyage time while avoiding hazardous conditions. It considers factors like wind, waves, currents, and vessel characteristics.",
      "tropical cyclones":
        "Tropical cyclones (hurricanes, typhoons) are intense low-pressure systems with winds exceeding 64 knots. Vessels should avoid the dangerous semicircle (right side in Northern Hemisphere, left in Southern) and stay at least 50 nautical miles from the eye.",
    },
    general:
      "I'm the Maritime Assistant, designed to help with navigation, regulations, weather, and emergency procedures. Please ask a specific maritime question, and I'll provide the most accurate information available.",
  }

  // Check if the message contains specific keywords and return appropriate response
  const lowerMessage = message.toLowerCase()

  if (category === "navigation") {
    if (lowerMessage.includes("colreg") && lowerMessage.includes("crossing")) {
      return fallbackResponses.navigation["colregs crossing rules"]
    } else if (lowerMessage.includes("eta") || lowerMessage.includes("estimated time")) {
      return fallbackResponses.navigation["calculating eta"]
    } else if (lowerMessage.includes("navigation light")) {
      return fallbackResponses.navigation["navigation lights"]
    } else if (lowerMessage.includes("chart")) {
      return fallbackResponses.navigation["reading nautical charts"]
    }
  } else if (category === "emergency") {
    if (lowerMessage.includes("man overboard") || lowerMessage.includes("person overboard")) {
      return fallbackResponses.emergency["man overboard procedure"]
    } else if (lowerMessage.includes("distress signal")) {
      return fallbackResponses.emergency["distress signals"]
    } else if (lowerMessage.includes("fire")) {
      return fallbackResponses.emergency["fire response"]
    } else if (lowerMessage.includes("gmdss")) {
      return fallbackResponses.emergency["gmdss procedures"]
    }
  } else if (category === "regulations") {
    if (lowerMessage.includes("colreg")) {
      return fallbackResponses.regulations["colregs"]
    } else if (lowerMessage.includes("marpol")) {
      return fallbackResponses.regulations["marpol"]
    } else if (lowerMessage.includes("solas")) {
      return fallbackResponses.regulations["solas"]
    }
  } else if (category === "weather") {
    if (lowerMessage.includes("beaufort")) {
      return fallbackResponses.weather["beaufort scale"]
    } else if (lowerMessage.includes("routing")) {
      return fallbackResponses.weather["weather routing"]
    } else if (
      lowerMessage.includes("cyclone") ||
      lowerMessage.includes("hurricane") ||
      lowerMessage.includes("typhoon")
    ) {
      return fallbackResponses.weather["tropical cyclones"]
    }
  }

  // Default response if no specific match
  return fallbackResponses.general
}
