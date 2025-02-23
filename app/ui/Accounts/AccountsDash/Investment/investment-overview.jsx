"use client";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Edit2, ChevronRight } from "lucide-react"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

const InvestmentOverview = ({
  data
}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  const years = Array.from(new Set(data?.map((item) => new Date(item.date).getFullYear()))).sort((a, b) => b - a)

  const filteredData = data?.filter(
    (item) => new Date(item.date).getFullYear() === Number.parseInt(selectedYear)
  )

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Cleared: "bg-green-100 text-green-800",
      Bounced: "bg-red-100 text-red-800",
    }
    return <Badge className={statusStyles[status]}>{status}</Badge>;
  }

  const downloadPDF = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(16)
    doc.text(`Investment Overview - ${selectedYear}`, 14, 15)

    // Add timestamp
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22)

    // Create table data
    const tableData = filteredData.map((item) => [
      new Date(item.date).toLocaleDateString(),
      item.customerName,
      item.voucherNo,
      new Date(item.issueDate).toLocaleDateString(),
      item.mode,
      item.status,
      `$${item.amount.toFixed(2)}`,
    ])

    // Add table
    doc.autoTable({
      head: [["Date", "Investor Name", "Voucher No.", "Mode", "Status", "Amount"]],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [51, 51, 51] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    })

    // Add summary
    const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0)
    doc.setFontSize(12)
    doc.text(
      `Total Amount: $${totalAmount.toFixed(2)}`,
      14,
      doc.internal.pageSize.height - 20
    )

    doc.save(`Investment-overview-${selectedYear}.pdf`)
  }

  return (
    (<div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Investment Balance Overview</h1>
        <div className="flex items-center gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            {filteredData?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>{item.investorName}</TableCell>
                <TableCell>{item.voucherNo}</TableCell>
                <TableCell>{new Date(item.submissionDate).toLocaleDateString()}</TableCell>
                <TableCell>{item.mode}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-right font-medium">${item.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Edit2 className="w-4 h-4" />
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
    </div>)
  );
}

export default InvestmentOverview

