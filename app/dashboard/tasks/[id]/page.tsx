import { notFound } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"
import { ArrowLeft, Pencil } from "lucide-react"
import TaskTimeTracker from "@/app/components/TaskTimeTracker"

export default async function TaskDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()
  const { db } = await connectToDatabase()

  try {
    // Get task details
    const task = await db.collection("tasks").findOne({
      _id: new ObjectId(params.id),
      userId: session?.id,
    })

    if (!task) {
      notFound()
    }

    const getStatusBadgeClass = (status: string) => {
      switch (status) {
        case "To-Do":
          return "badge-todo"
        case "In Progress":
          return "badge-progress"
        case "Done":
          return "badge-done"
        default:
          return "badge-todo"
      }
    }

    // Format date
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date)
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard/tasks" className="text-primary hover:text-primary-dark mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold">{task.title}</h1>
          </div>
          <Link href={`/dashboard/tasks/${params.id}/edit`} className="btn-secondary inline-flex items-center">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Task
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-secondary">Task Details</h3>
              <p className="mt-1 max-w-2xl text-sm text-secondary-light">Created on {formatDate(task.createdAt)}</p>
            </div>
            <div className={`badge ${getStatusBadgeClass(task.status)}`}>{task.status}</div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-background-alt px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-secondary-light">Description</dt>
                <dd className="mt-1 text-sm text-secondary sm:mt-0 sm:col-span-2">
                  {task.description || "No description provided"}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-secondary-light">Estimated Hours</dt>
                <dd className="mt-1 text-sm text-secondary sm:mt-0 sm:col-span-2">{task.estimatedHours}</dd>
              </div>
              <div className="bg-background-alt px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-secondary-light">Actual Hours</dt>
                <dd className="mt-1 text-sm text-secondary sm:mt-0 sm:col-span-2">{task.actualHours || 0}</dd>
              </div>
            </dl>
          </div>
        </div>

        <TaskTimeTracker taskId={params.id} initialHours={task.actualHours || 0} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching task:", error)
    notFound()
  }
}
