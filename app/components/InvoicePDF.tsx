"use client"

import { useRef } from "react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { Download } from "lucide-react"

type InvoicePDFProps = {
  invoice: any
  user: any
  formattedDate: string
}

export default function InvoicePDF({ invoice, user, formattedDate }: InvoicePDFProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)

  const generatePDF = async () => {
    if (!invoiceRef.current) return

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    })

    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
    pdf.save(`invoice-${invoice._id.toString().substring(0, 8)}.pdf`)
  }

  return (
    <div>
      <button onClick={generatePDF} className="btn-secondary inline-flex items-center">
        <Download className="h-4 w-4 mr-2" />
        Download PDF
      </button>
      <div ref={invoiceRef} className="max-w-4xl mx-auto bg-white p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-primary">FreelanceSprint</h1>
            <p className="text-secondary-light mt-1">{user.name}</p>
            <p className="text-secondary-light">{user.email}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <p className="text-secondary-light mt-1">#{invoice._id.toString().substring(0, 8)}</p>
            <p className="text-secondary-light">Date: {formattedDate}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium border-b border-gray-200 pb-2">Tasks</h3>
          <table className="min-w-full mt-4">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-secondary-light">Description</th>
                <th className="text-right text-sm font-medium text-secondary-light">Hours</th>
                <th className="text-right text-sm font-medium text-secondary-light">Rate</th>
                <th className="text-right text-sm font-medium text-secondary-light">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.tasks.map((task: any) => (
                <tr key={task._id.toString()}>
                  <td className="py-4 text-sm text-secondary">{task.title}</td>
                  <td className="py-4 text-sm text-secondary text-right">{task.actualHours}</td>
                  <td className="py-4 text-sm text-secondary text-right">${invoice.hourlyRate.toFixed(2)}</td>
                  <td className="py-4 text-sm text-secondary text-right">
                    ${(task.actualHours * invoice.hourlyRate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={3} className="pt-6 text-right text-base font-medium text-secondary">
                  Total
                </th>
                <th className="pt-6 text-right text-base font-medium text-primary">
                  ${invoice.totalAmount.toFixed(2)}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <h3 className="text-lg font-medium">Payment Details</h3>
          <p className="text-secondary-light mt-2">Please make payment within 14 days of receiving this invoice.</p>
        </div>

        <div className="mt-8 text-center text-sm text-secondary-light">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  )
}
