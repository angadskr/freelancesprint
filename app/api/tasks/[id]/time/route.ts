import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { actualHours } = await request.json()

    if (actualHours === undefined || actualHours < 0) {
      return NextResponse.json({ error: "Invalid hours value" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Verify task belongs to user
    const task = await db.collection("tasks").findOne({
      _id: new ObjectId(params.id),
      userId: session.id,
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Update task hours
    await db.collection("tasks").updateOne({ _id: new ObjectId(params.id) }, { $set: { actualHours: actualHours } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating task time:", error)
    return NextResponse.json({ error: "Failed to update task time" }, { status: 500 })
  }
}
