import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get all invoices for the user
    const invoices = await db
      .collection("invoices")
      .find({
        userId: session.id,
      })
      .toArray()

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { taskIds, hourlyRate, totalAmount } = await request.json()

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json({ error: "No tasks selected" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Verify all tasks belong to the user
    const tasks = await db
      .collection("tasks")
      .find({
        _id: { $in: taskIds.map((id) => new ObjectId(id)) },
        userId: session.id,
      })
      .toArray()

    if (tasks.length !== taskIds.length) {
      return NextResponse.json({ error: "Invalid task selection" }, { status: 400 })
    }

    // Create invoice
    const result = await db.collection("invoices").insertOne({
      userId: session.id,
      taskIds: taskIds.map((id) => new ObjectId(id)),
      tasks: tasks.map((task) => ({
        _id: task._id,
        title: task.title,
        actualHours: task.actualHours,
      })),
      hourlyRate,
      totalAmount,
      status: "Unpaid",
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
        invoiceId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}
