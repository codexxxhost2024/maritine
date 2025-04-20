import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Get the path from the request
    const path = params.path.join("/")

    // Construct the URL to the OpenWeatherMap API
    const apiKey = process.env.OPENWEATHERMAP_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const url = `https://tile.openweathermap.org/map/${path}?appid=${apiKey}`

    // Fetch the tile from OpenWeatherMap
    const response = await fetch(url, { next: { revalidate: 3600 } }) // Cache for 1 hour

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status}`)
    }

    // Get the response as an array buffer
    const buffer = await response.arrayBuffer()

    // Return the tile with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error proxying weather tile:", error)

    // Return a fallback transparent image
    const fallbackImage = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0a, 0x49,
      0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00,
      0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ])

    return new NextResponse(fallbackImage, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=60",
      },
    })
  }
}
