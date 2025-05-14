import type React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/app/lib/auth"
import Navbar from "@/app/components/Navbar"
import Sidebar from "@/app/components/Sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background-alt">
      <Navbar user={session} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
