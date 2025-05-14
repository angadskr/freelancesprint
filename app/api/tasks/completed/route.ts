import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get completed tasks that have actual hours
    const tasks = await db
      .collection("tasks")
      .find({
        userId: session.id,
        status: "Done",
        actualHours: { $gt: 0 },
      })
      .toArray()

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching completed tasks:", error)
    return NextResponse.json({ error: "Failed to fetch completed tasks" }, { status: 500 })
  }
}
