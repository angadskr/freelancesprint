import Link from "next/link"
import { getSession } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import { PlusCircle } from "lucide-react"

export default async function TasksPage() {
  const session = await getSession()
  const { db } = await connectToDatabase()

  // Get all tasks for the user
  const tasks = await db.collection("tasks").find({ userId: session?.id }).sort({ createdAt: -1 }).toArray()

  // Count tasks by status
  const todoCount = tasks.filter((task) => task.status === "To-Do").length
  const inProgressCount = tasks.filter((task) => task.status === "In Progress").length
  const doneCount = tasks.filter((task) => task.status === "Done").length

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Link href="/dashboard/tasks/new" className="btn-primary inline-flex items-center">
          <PlusCircle className="h-5 w-5 mr-2" />
          New Task
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-yellow-100 text-yellow-600">
                <span className="text-lg font-bold">{todoCount}</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-secondary-light truncate">To-Do</dt>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-blue-100 text-blue-600">
                <span className="text-lg font-bold">{inProgressCount}</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-secondary-light truncate">In Progress</dt>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-green-100 text-green-600">
                <span className="text-lg font-bold">{doneCount}</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-secondary-light truncate">Done</dt>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <li className="px-6 py-4 text-center text-secondary-light">No tasks yet. Create your first task!</li>
          ) : (
            tasks.map((task) => (
              <li key={task._id}>
                <Link href={`/dashboard/tasks/${task._id}`} className="block hover:bg-background-alt">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary truncate">{task.title}</p>
                      <div className={`badge ${getStatusBadgeClass(task.status)}`}>{task.status}</div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-secondary-light">
                          {task.description
                            ? task.description.substring(0, 100) + (task.description.length > 100 ? "..." : "")
                            : "No description"}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-secondary-light sm:mt-0">
                        <p>
                          {task.actualHours} / {task.estimatedHours} hours
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
