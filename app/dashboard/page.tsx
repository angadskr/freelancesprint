import { getSession } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import DashboardStats from "@/app/components/DashboardStats"
import TaskOverview from "@/app/components/TaskOverview"
import RecentInvoices from "@/app/components/RecentInvoices"
import { redirect } from "next/navigation"
import Image from "next/image"
import QuoteSection from "@/app/components/QuoteSection"

export default async function DashboardPage() {
  const session = await getSession()
  const { db } = await connectToDatabase()
  if (!session) redirect("/login")

  // Get dashboard stats
  const totalTasks = await db.collection("tasks").countDocuments({ userId: session?.id })
  const completedTasks = await db.collection("tasks").countDocuments({
    userId: session?.id,
    status: "Done",
  })

  // Get total hours worked
  const tasksWithHours = await db
    .collection("tasks")
    .find({
      userId: session?.id,
    })
    .toArray()

  const totalHours = tasksWithHours.reduce((sum, task) => sum + (task.actualHours || 0), 0)

  // Get total invoice value
  const invoices = await db
    .collection("invoices")
    .find({
      userId: session?.id,
    })
    .toArray()

  const totalInvoiceValue = invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0)

  // Get recent tasks
  const recentTasks = await db
    .collection("tasks")
    .find({ userId: session?.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray()

  // Get recent invoices
  const recentInvoices = await db
    .collection("invoices")
    .find({ userId: session?.id })
    .sort({ createdAt: -1 })
    .limit(3)
    .toArray()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <DashboardStats
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        totalHours={totalHours}
        totalInvoiceValue={totalInvoiceValue}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskOverview tasks={recentTasks} />
        <RecentInvoices invoices={recentInvoices} />
      </div>

      {/* Motivational Quote Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl shadow-sm">
        <QuoteSection />
      </div>

      {/* Images Section */}
      <div className="flex justify-center gap-6 mt-8">
        <div className="relative w-[600px] h-[400px]">
          <Image
            src="/image-from-rawpixel-id-12037659-jpeg Background Removed 1.png" 
            alt="Dashboard Image 1"
            fill
            className="object-cover rounded-xl shadow-md"
          />
        </div>
        <div className="relative w-[500px] h-[400px]">
          <Image
            src="/Employee onboarding process, people diving into an aquarium.png" 
            alt="Dashboard Image 2"
            fill
            className="object-cover rounded-xl shadow-md"
          />
        </div>
      </div>
    </div>
  )
}
