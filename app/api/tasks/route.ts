import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"

// GET all tasks for the current user
export async function GET(request: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Query tasks for the current user only
    const tasks = await db.collection("tasks").find({ userId: session.id }).toArray()

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

// POST a new task
export async function POST(request: NextRequest) {
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

    // Create a new task with the user ID
    const result = await db.collection("tasks").insertOne({
      title,
      description,
      status: status || "To-Do",
      estimatedHours: estimatedHours || 0,
      actualHours: 0,
      userId: session.id,
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
        taskId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
