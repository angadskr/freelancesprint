import { notFound } from "next/navigation"
import { getSession } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import { ObjectId } from "mongodb"
import InvoiceDetailClient from "./InvoiceDetailClient"

export default async function InvoiceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()
  const { db } = await connectToDatabase()

  try {
    // Get invoice details
    const invoice = await db.collection("invoices").findOne({
      _id: new ObjectId(params.id),
      userId: session?.id,
    })

    if (!invoice) {
      notFound()
    }

    // Format date for display
    const formattedDate = new Date(invoice.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

    return <InvoiceDetailClient invoice={invoice} user={session} formattedDate={formattedDate} />
  } catch (error) {
    console.error("Error fetching invoice:", error)
    notFound()
  }
}
