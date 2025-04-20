import { NextResponse } from "next/server"
import { generateText } from "ai"
import { GoogleGenerativeAI } from "@ai-sdk/google"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { vessel, voyage, conditions, riskFactors } = body

    if (!vessel?.name || !voyage?.origin || !voyage?.destination) {
      return NextResponse.json({ error: "Vessel name, origin, and destination are required" }, { status: 400 })
    }

    // For demo purposes, we'll skip the caching to avoid potential errors
    // and generate the assessment data directly

    try {
      // Generate risk assessment data
      const assessmentData = generateRiskAssessment(vessel, voyage, conditions, riskFactors)

      // Generate AI analysis if GEMINI_API_KEY is available
      if (process.env.GEMINI_API_KEY) {
        try {
          const aiAnalysis = await generateRiskAnalysis(assessmentData)
          assessmentData.aiAnalysis = aiAnalysis
        } catch (analysisError) {
          console.error("Error generating AI analysis:", analysisError)
          // Provide a fallback analysis if AI generation fails
          assessmentData.aiAnalysis = "AI analysis could not be generated at this time. Please try again later."
        }
      } else {
        assessmentData.aiAnalysis =
          "AI analysis is not available. Please configure the GEMINI_API_KEY environment variable."
      }

      // Try to cache the data in Supabase if available
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
          const cacheKey = `risk:${vessel.name}:${voyage.origin}:${voyage.destination}:${JSON.stringify(riskFactors)}`
          await supabase.from("risk_assessment_cache").upsert({
            cache_key: cacheKey,
            data: JSON.stringify(assessmentData),
            created_at: new Date().toISOString(),
          })
        } catch (cacheError) {
          // Log but don't fail if caching fails
          console.error("Error caching risk assessment:", cacheError)
        }
      }

      return NextResponse.json(assessmentData)
    } catch (error) {
      console.error("Error in risk assessment generation:", error)
      return NextResponse.json({ error: "Failed to generate risk assessment" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error parsing request:", error)
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
  }
}

function generateRiskAssessment(vessel, voyage, conditions, selectedRiskFactors) {
  // This is a simplified version - in a real app, this would be much more sophisticated
  const riskFactors = []
  const riskCategories = {
    weather: "Weather & Sea Conditions",
    navigation: "Navigation Hazards",
    mechanical: "Mechanical & Equipment Failures",
    crew: "Crew Fatigue & Human Factors",
    cargo: "Cargo-Related Risks",
    security: "Security Threats",
    environmental: "Environmental Hazards",
    regulatory: "Regulatory Compliance",
    communication: "Communication Failures",
    medical: "Medical Emergencies",
  }

  // Generate risk factors based on selected categories
  selectedRiskFactors.forEach((factorId) => {
    const category = riskCategories[factorId]

    // Generate 1-3 specific risks for each category
    const numRisks = 1 + Math.floor(Math.random() * 3)

    for (let i = 0; i < numRisks; i++) {
      const likelihood = 1 + Math.floor(Math.random() * 5)
      const impact = 1 + Math.floor(Math.random() * 5)
      const score = likelihood * impact

      let level = "low"
      if (score >= 15) {
        level = "critical"
      } else if (score >= 10) {
        level = "high"
      } else if (score >= 5) {
        level = "medium"
      }

      const riskNames = {
        weather: ["Severe Storm", "High Waves", "Poor Visibility"],
        navigation: ["Shallow Waters", "Heavy Traffic", "Narrow Passages"],
        mechanical: ["Engine Failure", "Navigation Equipment Malfunction", "Power Loss"],
        crew: ["Fatigue", "Inadequate Training", "Communication Issues"],
        cargo: ["Cargo Shift", "Hazardous Materials", "Overloading"],
        security: ["Piracy", "Cyber Attack", "Unauthorized Access"],
        environmental: ["Oil Spill", "Marine Life Collision", "Emissions Compliance"],
        regulatory: ["Documentation Issues", "Inspection Failure", "Permit Violations"],
        communication: ["Radio Failure", "Satellite Connection Loss", "Miscommunication"],
        medical: ["Medical Emergency", "Inadequate Medical Supplies", "Delayed Response"],
      }

      const descriptions = {
        weather: [
          "Risk of encountering severe weather conditions during voyage",
          "High waves may affect vessel stability and operations",
          "Reduced visibility due to fog or precipitation",
        ],
        navigation: [
          "Navigating through shallow waters with risk of grounding",
          "High traffic areas increasing collision risk",
          "Narrow passages requiring precise navigation",
        ],
        mechanical: [
          "Potential for engine or propulsion system failure",
          "Risk of navigation or communication equipment malfunction",
          "Electrical systems or power generation failure",
        ],
        crew: [
          "Extended voyage duration may lead to crew fatigue",
          "Crew may lack specific training for encountered conditions",
          "Language or cultural barriers affecting communication",
        ],
        cargo: [
          "Risk of cargo shifting during heavy weather",
          "Transporting hazardous materials with special handling requirements",
          "Vessel stability issues due to cargo distribution",
        ],
        security: [
          "Route passes through areas with history of piracy",
          "Vulnerability to cyber attacks on navigation systems",
          "Risk of unauthorized access to vessel or systems",
        ],
        environmental: [
          "Risk of fuel or oil spill in sensitive marine areas",
          "Potential for collision with marine life",
          "Emissions compliance in regulated waters",
        ],
        regulatory: [
          "Incomplete or incorrect documentation for ports of call",
          "Risk of failing port state or flag state inspections",
          "Missing permits for specific operations or areas",
        ],
        communication: [
          "Potential for communication equipment failure in remote areas",
          "Loss of satellite connectivity affecting operations",
          "Miscommunication between vessel and shore or other vessels",
        ],
        medical: [
          "Limited medical facilities for handling serious emergencies",
          "Insufficient medical supplies for extended voyage",
          "Delayed medical evacuation in remote areas",
        ],
      }

      // Make sure we have valid risk names and descriptions for this category
      const riskNamesArray = riskNames[factorId] || ["Unknown Risk"]
      const descriptionsArray = descriptions[factorId] || ["Unknown risk description"]

      riskFactors.push({
        id: `${factorId}-${i}`,
        name: riskNamesArray[i % riskNamesArray.length],
        category: category || "Unknown Category",
        likelihood,
        impact,
        score,
        level,
        description: descriptionsArray[i % descriptionsArray.length],
      })
    }
  })

  // Calculate overall risk score and level
  const totalScore = riskFactors.reduce((sum, factor) => sum + factor.score, 0)
  const avgScore = riskFactors.length > 0 ? totalScore / riskFactors.length : 0
  const normalizedScore = Math.min(100, Math.round((avgScore / 25) * 100))

  let overallRiskLevel = "low"
  if (avgScore >= 15) {
    overallRiskLevel = "critical"
  } else if (avgScore >= 10) {
    overallRiskLevel = "high"
  } else if (avgScore >= 5) {
    overallRiskLevel = "medium"
  }

  // Generate mitigation recommendations
  const recommendations = [
    "Regularly monitor weather forecasts and adjust route if necessary",
    "Ensure all navigation equipment is properly maintained and calibrated",
    "Implement a comprehensive crew rest management system",
    "Conduct regular safety drills and equipment checks",
    "Maintain open communication with port authorities and nearby vessels",
  ]

  // Generate priority actions based on highest risk factors
  const highRiskFactors = riskFactors.filter((factor) => factor.level === "critical" || factor.level === "high")
  const priorityActions = highRiskFactors.map((factor) => {
    const actions = {
      "Severe Storm": "Adjust route to avoid forecasted storm areas and prepare vessel for heavy weather",
      "High Waves": "Reduce speed in high wave conditions and secure all loose equipment",
      "Poor Visibility": "Use radar and other navigation aids in low visibility conditions and reduce speed",
      "Shallow Waters": "Carefully review charts and maintain safe under-keel clearance in shallow areas",
      "Heavy Traffic": "Maintain proper lookout and follow collision regulations in high traffic areas",
      "Narrow Passages": "Plan transit through narrow passages during optimal conditions and tides",
      "Engine Failure": "Conduct thorough engine maintenance before departure and carry essential spare parts",
      "Navigation Equipment Malfunction": "Test all navigation equipment before departure and have backup systems",
      "Power Loss": "Ensure backup power systems are operational and crew is trained in emergency procedures",
      Fatigue: "Implement strict watch schedules and ensure adequate rest periods for all crew members",
      "Inadequate Training": "Provide additional training for crew on specific equipment and procedures",
      "Communication Issues": "Establish clear communication protocols and ensure language barriers are addressed",
      "Cargo Shift": "Properly secure all cargo before departure and regularly inspect during voyage",
      "Hazardous Materials": "Ensure proper documentation and handling procedures for all hazardous materials",
      Overloading: "Verify vessel loading is within safe limits and properly distributed",
      Piracy: "Implement anti-piracy measures when transiting high-risk areas",
      "Cyber Attack": "Update all software systems and implement cybersecurity protocols",
      "Unauthorized Access": "Enhance vessel security measures and conduct regular security drills",
      "Oil Spill": "Review and test oil spill response procedures before departure",
      "Marine Life Collision": "Maintain proper lookout in areas with high marine life activity",
      "Emissions Compliance": "Ensure fuel and emissions systems comply with regulations in all transit areas",
      "Documentation Issues": "Double-check all required documentation before departure",
      "Inspection Failure": "Conduct internal inspection using official checklists before port arrival",
      "Permit Violations": "Verify all required permits are obtained for the entire voyage",
      "Radio Failure": "Test all communication equipment and have backup systems available",
      "Satellite Connection Loss": "Have alternative communication methods available for critical information",
      Miscommunication: "Establish clear communication protocols and conduct regular briefings",
      "Medical Emergency": "Ensure medical supplies are adequate and crew has basic medical training",
      "Inadequate Medical Supplies": "Review and replenish medical supplies before departure",
      "Delayed Response": "Establish clear procedures for medical emergencies and evacuation options",
    }

    return actions[factor.name] || `Address ${factor.name} risk through proper planning and preparation`
  })

  // Generate contingency plans
  const contingencyPlans = [
    "If severe weather is encountered, alter course to minimize impact and reduce speed as necessary",
    "In case of engine failure, follow emergency procedures and request assistance if needed",
    "If navigation equipment fails, use backup systems and traditional navigation methods",
    "For medical emergencies, contact TMAS (Telemedical Assistance Service) and consider evacuation options",
    "In case of security threats, follow company security plan and alert authorities",
  ]

  return {
    vesselInfo: {
      name: vessel.name,
      type: vessel.type || "Unknown",
      size: vessel.size || "Medium",
      crew: vessel.crew || 0,
    },
    voyage: {
      origin: voyage.origin,
      destination: voyage.destination,
      date: voyage.departureDate || new Date().toISOString().split("T")[0],
      duration: voyage.duration || 7,
    },
    riskFactors,
    overallRiskScore: normalizedScore,
    overallRiskLevel,
    mitigationPlan: {
      recommendations,
      priorityActions:
        priorityActions.length > 0 ? priorityActions : ["No high-priority actions required at this time"],
      contingencyPlans,
    },
  }
}

async function generateRiskAnalysis(assessmentData) {
  // Construct a detailed prompt for Gemini
  const prompt = `
    You are a maritime risk assessment expert. Analyze the following risk assessment data:
    
    Vessel: ${assessmentData.vesselInfo.name} (${assessmentData.vesselInfo.type}, ${assessmentData.vesselInfo.size})
    Voyage: ${assessmentData.voyage.origin} to ${assessmentData.voyage.destination}, ${assessmentData.voyage.duration} days
    
    Overall Risk Level: ${assessmentData.overallRiskLevel.toUpperCase()}
    
    Key Risk Factors:
    ${assessmentData.riskFactors
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(
        (factor) => `- ${factor.name} (${factor.category}): ${factor.level.toUpperCase()} risk - ${factor.description}`,
      )
      .join("\n")}
    
    Provide a detailed analysis of these risks, including:
    1. Overall assessment of the voyage risk profile
    2. Analysis of the most significant risk factors
    3. Evaluation of the interaction between different risk factors
    4. Recommendations for risk mitigation
    5. Suggestions for contingency planning
    
    Use maritime terminology and be specific about how these risks might affect this particular vessel and voyage. Format your response in clear paragraphs with appropriate line breaks.
  `

  try {
    // Check if GEMINI_API_KEY is available
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured")
    }

    // Use the AI SDK to generate text with Gemini
    const { text } = await generateText({
      model: GoogleGenerativeAI("gemini-pro"),
      prompt: prompt,
      maxTokens: 1024,
    })

    return text
  } catch (error) {
    console.error("Error generating text with Gemini:", error)
    return `Unable to generate risk analysis. Please try again later.`
  }
}
