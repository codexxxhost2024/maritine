import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware is now empty as we're handling the OpenWeatherMap tiles
// through a dedicated API route
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Empty matcher to disable the middleware
export const config = {
  matcher: [],
}
