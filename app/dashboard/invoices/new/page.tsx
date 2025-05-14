"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type Task = {
  _id: string
  title: string
  status: string
  actualHours: number
  hourlyRate?: number
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [hourlyRate, setHourlyRate] = useState<number>(50)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTasks() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/tasks/completed")

        if (!response.ok) {
          throw new Error("Failed to fetch completed tasks")
        }

        const data = await response.json()
        setTasks(data.tasks || [])
      } catch (err) {
        console.error("Error fetching tasks:", err)
        setError("Failed to load completed tasks")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId)
      } else {
        return [...prev, taskId]
      }
    })
  }

  const calculateTotal = () => {
    return tasks
      .filter((task) => selectedTasks.includes(task._id))
      .reduce((total, task) => total + task.actualHours * hourlyRate, 0)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (selectedTasks.length === 0) {
      setError("Please select at least one task")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskIds: selectedTasks,
          hourlyRate,
          totalAmount: calculateTotal(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create invoice")
      }

      const data = await response.json()
      router.push(`/dashboard/invoices/${data.invoiceId}`)
    } catch (err) {
      console.error("Error creating invoice:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/dashboard/invoices" className="text-primary hover:text-primary-dark mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">New Invoice</h1>
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
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-secondary">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                name="hourlyRate"
                id="hourlyRate"
                min="1"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="form-input mt-1 w-full sm:w-1/4"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-secondary">Select Tasks</h3>

              {isLoading ? (
                <div className="mt-4 text-center py-4">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="mt-4 text-center py-4 text-secondary-light">
                  No completed tasks available for invoicing
                </div>
              ) : (
                <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-background-alt">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-secondary-light uppercase tracking-wider"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-primary border-gray-300 rounded"
                            checked={selectedTasks.length === tasks.length}
                            onChange={() => {
                              if (selectedTasks.length === tasks.length) {
                                setSelectedTasks([])
                              } else {
                                setSelectedTasks(tasks.map((task) => task._id))
                              }
                            }}
                          />
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-secondary-light uppercase tracking-wider"
                        >
                          Task
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-secondary-light uppercase tracking-wider"
                        >
                          Hours
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-secondary-light uppercase tracking-wider"
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tasks.map((task) => (
                        <tr
                          key={task._id}
                          className={selectedTasks.includes(task._id) ? "bg-primary-light bg-opacity-20" : ""}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-primary border-gray-300 rounded"
                              checked={selectedTasks.includes(task._id)}
                              onChange={() => handleTaskSelection(task._id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-secondary">{task.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-secondary">{task.actualHours}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-secondary">${(task.actualHours * hourlyRate).toFixed(2)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-secondary">Total</h3>
                <span className="text-2xl font-bold text-primary">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/dashboard/invoices" className="btn-secondary mr-3">
                Cancel
              </Link>
              <button type="submit" disabled={isSubmitting || selectedTasks.length === 0} className="btn-primary">
                {isSubmitting ? "Creating..." : "Generate Invoice"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
