import Link from "next/link"
import { PlusCircle } from "lucide-react"

type Task = {
  _id: string
  title: string
  description: string
  status: "To-Do" | "In Progress" | "Done"
  estimatedHours: number
  actualHours: number
  createdAt: string
}

export default function TaskOverview({ tasks }: { tasks: Task[] }) {
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
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-secondary">Recent Tasks</h3>
        <Link
          href="/dashboard/tasks/new"
          className="inline-flex items-center text-sm text-primary hover:text-primary-dark"
        >
          <PlusCircle className="h-5 w-5 mr-1" />
          New Task
        </Link>
      </div>
      <div className="border-t border-gray-200">
        <div className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <div className="px-4 py-5 sm:px-6 text-center text-secondary-light">
              No tasks yet. Create your first task!
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id.toString()} className="px-4 py-4 sm:px-6 hover:bg-background-alt">
                <Link href={`/dashboard/tasks/${task._id}`} className="block">
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
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
        <Link href="/dashboard/tasks" className="text-sm font-medium text-primary hover:text-primary-dark">
          View all tasks
        </Link>
      </div>
    </div>
  )
}
