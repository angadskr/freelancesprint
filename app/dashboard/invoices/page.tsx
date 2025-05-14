import Link from "next/link"
import { getSession } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import { PlusCircle } from "lucide-react"

export default async function InvoicesPage() {
  const session = await getSession()
  const { db } = await connectToDatabase()

  // Get all invoices for the user
  const invoices = await db.collection("invoices").find({ userId: session?.id }).sort({ createdAt: -1 }).toArray()

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Link href="/dashboard/invoices/new" className="btn-primary inline-flex items-center">
          <PlusCircle className="h-5 w-5 mr-2" />
          New Invoice
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {invoices.length === 0 ? (
            <li className="px-6 py-4 text-center text-secondary-light">No invoices yet. Create your first invoice!</li>
          ) : (
            invoices.map((invoice) => (
              <li key={invoice._id}>
                <Link href={`/dashboard/invoices/${invoice._id}`} className="block hover:bg-background-alt">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary truncate">
                        Invoice #{invoice._id.toString().substring(0, 8)}
                      </p>
                      <div className="badge bg-green-100 text-green-800">{invoice.status || "Paid"}</div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-secondary-light">
                          {formatDate(invoice.createdAt)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm font-medium text-secondary sm:mt-0">
                        ${invoice.totalAmount.toFixed(2)}
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
