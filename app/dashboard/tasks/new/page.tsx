"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewTaskPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const taskData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      estimatedHours: Number.parseFloat(formData.get("estimatedHours") as string) || 0,
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create task")
      }

      router.push("/dashboard/tasks")
      router.refresh()
    } catch (err) {
      console.error("Error creating task:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/dashboard/tasks" className="text-primary hover:text-primary-dark mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">New Task</h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-secondary">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="form-input mt-1"
                placeholder="Task title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                className="form-input mt-1"
                placeholder="Task description"
              ></textarea>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-secondary">
                Status
              </label>
              <select name="status" id="status" className="form-input mt-1" defaultValue="To-Do">
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-medium text-secondary">
                Estimated Hours
              </label>
              <input
                type="number"
                name="estimatedHours"
                id="estimatedHours"
                min="0"
                step="0.5"
                className="form-input mt-1"
                placeholder="0"
              />
            </div>

            <div className="flex justify-end">
              <Link href="/dashboard/tasks" className="btn-secondary mr-3">
                Cancel
              </Link>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
