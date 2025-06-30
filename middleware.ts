import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decrypt } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define protected routes
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/projects") || pathname.startsWith("/bids")

  // Define auth routes
  const isAuthRoute = pathname.startsWith("/auth/")

  // Get the session token from cookies
  const sessionCookie = request.cookies.get("session")
  let isLoggedIn = false

  if (sessionCookie) {
    try {
      const session = await decrypt(sessionCookie.value)
      isLoggedIn = !!session && new Date(session.expires) > new Date()
    } catch (error) {
      // Invalid session
      isLoggedIn = false
    }
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect non-logged-in users to sign-in for protected routes
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
