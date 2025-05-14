"use client"

import Link from "next/link"
import { Download, Printer, ArrowLeft } from "lucide-react"
import InvoiceView from "@/app/components/InvoiceView"
import InvoicePDF from "@/app/components/InvoicePDF"

type InvoiceDetailClientProps = {
  invoice: any
  user: any
  formattedDate: string
}

export default function InvoiceDetailClient({ invoice, user, formattedDate }: InvoiceDetailClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard/invoices" className="text-primary hover:text-primary-dark mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold">Invoice #{invoice._id.toString().substring(0, 8)}</h1>
        </div>
        <div className="flex space-x-3">
          <InvoicePDF invoice={invoice} user={user} formattedDate={formattedDate} />
          <button onClick={() => window.print()} className="btn-secondary inline-flex items-center">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg print:shadow-none">
        <div className="px-4 py-5 sm:p-6">
          <InvoiceView invoice={invoice} user={user} formattedDate={formattedDate} />
        </div>
      </div>
    </div>
  )
} 