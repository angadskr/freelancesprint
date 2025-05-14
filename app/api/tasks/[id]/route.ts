import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a single task
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get task and verify it belongs to user
    const task = await db.collection("tasks").findOne({
      _id: new ObjectId(params.id),
      userId: session.id,
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

// PUT (update) a task
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, status, estimatedHours } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
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

    // Update task
    await db.collection("tasks").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          title,
          description,
          status,
          estimatedHours: estimatedHours || 0,
        },
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
} 