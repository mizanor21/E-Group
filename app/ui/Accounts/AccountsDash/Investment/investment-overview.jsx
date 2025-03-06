"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, ChevronRight } from "lucide-react"
import { IoCloudDownloadOutline } from "react-icons/io5"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable" // Ensure this import is correct

const InvestmentOverview = ({ data, selectedYear }) => {
  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Cleared: "bg-green-100 text-green-800",
      Overdue: "bg-red-100 text-red-800",
    }
    return <Badge className={statusStyles[status]}>{status}</Badge>
  }

  const downloadPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text(`Investment Overview - ${selectedYear}`, 14, 15)

    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22)

    const tableData = data?.map((item) => [
      new Date(item.date).toLocaleDateString(),
      item.investmentType,
      item.voucherNo,
      new Date(item.issueDate).toLocaleDateString(),
      new Date(item.maturityDate).toLocaleDateString(),
      `${item.returnRate}%`,
      item.status,
      `$${item.amount.toFixed(2)}`,
    ])

    autoTable(doc, {
      head: [["Date", "Type", "Voucher No.", "Issue Date", "Maturity Date", "Return Rate", "Status", "Amount"]],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [51, 51, 51] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    })

    const totalAmount = data?.reduce((sum, item) => sum + item.amount, 0) || 0
    doc.setFontSize(12)
    doc.text(`Total Investments: $${totalAmount.toFixed(2)}`, 14, doc.internal.pageSize.height - 20)

    doc.save(`investment-overview-${selectedYear}.pdf`)
  }

  const downloadMemoPDF = (item) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const centerX = pageWidth / 2
    
    // Modern header with bank name
    doc.setFillColor(33, 37, 41)
    doc.rect(0, 0, pageWidth, 30, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text("E-Group", 14, 20)
    
    // Transaction memo title
    doc.setTextColor(33, 37, 41)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text("Transaction Memo", centerX, 45, { align: 'center' })
    
    // Format dates for display
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
    
    const transactionDate = formatDate(item.date)
    const submissionDate = formatDate(item.submissionDate)
    
    // Key information section - transaction details
    doc.roundedRect(14, 55, pageWidth - 28, 90, 3, 3)
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text("Transaction Details", 20, 70)
    
    // Main transaction info
    const transactionData = [
      ["Investor", item.investorName],
      ["Voucher No", item.voucherNo],
      ["Transaction Date", transactionDate],
      ["Submission Date", submissionDate],
      ["Payment Mode", item.mode],
      ["Status", item.status]
    ]
    
    autoTable(doc, {
      startY: 75,
      margin: { left: 20, right: 20 },
      tableWidth: pageWidth - 40,
      theme: 'grid',
      headStyles: { fillColor: [240, 240, 240], textColor: [33, 37, 41], fontStyle: 'bold' },
      styles: { 
        fontSize: 10,
        cellPadding: 6,
        lineColor: [200, 200, 200]
      },
      body: transactionData,
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 80 },
        1: { cellWidth: pageWidth - 120 }
      }
    })
    
    // Amount section with highlight
    doc.setFillColor(13, 110, 253) // Bootstrap primary blue
    doc.roundedRect(14, 155, pageWidth - 28, 45, 3, 3, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text("Total Amount:", 25, 180)
    
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(`$${item.amount.toFixed(2)}`, pageWidth - 25, 180, { align: 'right' })
    
    // Reference information section
    doc.setTextColor(33, 37, 41)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text("Reference Information", 20, 220)
    
    doc.setDrawColor(220, 220, 220)
    doc.line(20, 225, pageWidth - 20, 225)
    
    const referenceData = [
      ["Transaction ID:", `TXN-${item.voucherNo}`],
      ["Creation Date:", new Date(item.createdAt).toLocaleString()],
    ]
    
    autoTable(doc, {
      startY: 230,
      margin: { left: 20, right: 20 },
      tableWidth: pageWidth - 40,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 3 },
      body: referenceData,
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 80 },
        1: { cellWidth: pageWidth - 120 }
      }
    })
    
    // Footer
    doc.setFillColor(240, 240, 240)
    doc.rect(0, doc.internal.pageSize.getHeight() - 25, pageWidth, 25, 'F')
    
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text("This is an electronically generated receipt. No signature required.", centerX, 
             doc.internal.pageSize.getHeight() - 15, { align: 'center' })
    doc.text(`Generated: ${new Date().toLocaleString()}`, centerX, 
             doc.internal.pageSize.getHeight() - 10, { align: 'center' })
    
    doc.save(`Transaction-${item.voucherNo}.pdf`)
  }
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Investment Balance Overview</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={downloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Investor Name</TableHead>
              <TableHead>Voucher No.</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>{item.investorName}</TableCell>
                <TableCell>{item.voucherNo}</TableCell>
                <TableCell>{new Date(item.submissionDate).toLocaleDateString()}</TableCell>
                <TableCell>{item.mode}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-right font-medium">${item.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => downloadMemoPDF(item)}>
                    <IoCloudDownloadOutline className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-center">
        <Button variant="link" className="text-blue-600">
          See More
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

export default InvestmentOverview