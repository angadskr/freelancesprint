"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Play, Pause, Save } from "lucide-react"

type TaskTimeTrackerProps = {
  taskId: string
  initialHours: number
}

export default function TaskTimeTracker({ taskId, initialHours }: TaskTimeTrackerProps) {
  const router = useRouter()
  const [hours, setHours] = useState(initialHours)
  const [manualHours, setManualHours] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = Date.now()
        const elapsed = (now - startTime) / 1000 / 60 / 60 // Convert ms to hours
        setElapsedTime(elapsed)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTracking, startTime])

  const startTimer = () => {
    setIsTracking(true)
    setStartTime(Date.now())
  }

  const stopTimer = async () => {
    if (!isTracking || !startTime) return

    setIsTracking(false)

    // Calculate hours spent
    const now = Date.now()
    const hoursSpent = (now - startTime) / 1000 / 60 / 60 // Convert ms to hours

    // Update total hours
    const newHours = hours + hoursSpent
    setHours(newHours)
    setElapsedTime(0)

    // Save to database
    await saveHours(newHours)
  }

  const handleManualSave = async () => {
    if (!manualHours) return

    const parsedHours = Number.parseFloat(manualHours)
    if (isNaN(parsedHours) || parsedHours < 0) {
      setError("Please enter a valid number of hours")
      return
    }

    const newHours = hours + parsedHours
    setHours(newHours)
    setManualHours("")

    await saveHours(newHours)
  }

  const saveHours = async (newHours: number) => {
    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/tasks/${taskId}/time`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ actualHours: newHours }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update time")
      }

      // Only refresh if successful
      router.refresh()
    } catch (err) {
      console.error("Error updating time:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      // Revert to previous hours on error
      setHours(initialHours)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-secondary">Time Tracking</h3>

        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-secondary-light mb-2">Timer</h4>
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold">
                {isTracking
                  ? `${Math.floor(elapsedTime)}h ${Math.floor((elapsedTime % 1) * 60)}m ${Math.floor(((elapsedTime * 60) % 1) * 60)}s`
                  : "00h 00m 00s"}
              </div>
              {!isTracking ? (
                <button
                  onClick={startTimer}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </button>
              ) : (
                <button
                  onClick={stopTimer}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Stop
                </button>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-secondary-light mb-2">Manual Entry</h4>
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <label htmlFor="manualHours" className="sr-only">
                  Hours
                </label>
                <input
                  type="number"
                  name="manualHours"
                  id="manualHours"
                  min="0"
                  step="0.25"
                  value={manualHours}
                  onChange={(e) => setManualHours(e.target.value)}
                  className="form-input"
                  placeholder="Enter hours"
                />
              </div>
              <button
                onClick={handleManualSave}
                disabled={!manualHours || isSaving}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium text-secondary">Total Hours Logged</h4>
            <span className="text-xl font-bold text-primary">{hours.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
