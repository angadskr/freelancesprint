import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/app/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user: session })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
  }
}
