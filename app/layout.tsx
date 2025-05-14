import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "./components/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "FreelanceSprint",
  description: "A Smart Task & Invoice App for Freelancers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
