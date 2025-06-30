import { type NextRequest, NextResponse } from "next/server"
import { logout } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await logout()
    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
