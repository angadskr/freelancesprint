import Link from "next/link"
import { PlusCircle } from "lucide-react"

type Invoice = {
  _id: string
  totalAmount: number
  createdAt: string
  status?: string
}

export default function RecentInvoices({ invoices }: { invoices: Invoice[] }) {
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
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-secondary">Recent Invoices</h3>
        <Link
          href="/dashboard/invoices/new"
          className="inline-flex items-center text-sm text-primary hover:text-primary-dark"
        >
          <PlusCircle className="h-5 w-5 mr-1" />
          New Invoice
        </Link>
      </div>
      <div className="border-t border-gray-200">
        <div className="divide-y divide-gray-200">
          {invoices.length === 0 ? (
            <div className="px-4 py-5 sm:px-6 text-center text-secondary-light">
              No invoices yet. Create your first invoice!
            </div>
          ) : (
            invoices.map((invoice) => (
              <div key={invoice._id.toString()} className="px-4 py-4 sm:px-6 hover:bg-background-alt">
                <Link href={`/dashboard/invoices/${invoice._id}`} className="block">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary truncate">
                      Invoice #{invoice._id.toString().substring(0, 8)}
                    </p>
                    <div className="badge bg-green-100 text-green-800">{invoice.status || "Paid"}</div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-secondary-light">{formatDate(invoice.createdAt)}</p>
                    </div>
                    <div className="mt-2 flex items-center text-sm font-medium text-secondary sm:mt-0">
                      ${invoice.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
        <Link href="/dashboard/invoices" className="text-sm font-medium text-primary hover:text-primary-dark">
          View all invoices
        </Link>
      </div>
    </div>
  )
}
