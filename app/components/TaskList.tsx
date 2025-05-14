"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Task = {
  _id: string
  title: string
  description: string
  status: "To-Do" | "In Progress" | "Done"
  estimatedHours: number
  actualHours: number
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true)
        const response = await fetch("/api/tasks")

        // If unauthorized, redirect to login
        if (response.status === 401) {
          router.push("/login")
          return
        }

        if (!response.ok) {
          throw new Error("Failed to fetch tasks")
        }

        const data = await response.json()
        setTasks(data.tasks || [])
      } catch (err) {
        setError("Error loading tasks. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [router])

  if (loading) return <div>Loading tasks...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found. Create your first task!</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task._id} className="border p-4 rounded-lg">
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <div className="flex justify-between mt-2">
                <span className="text-sm">Status: {task.status}</span>
                <span className="text-sm">
                  Hours: {task.actualHours}/{task.estimatedHours}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
