"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, ChevronRight, Filter, Search } from "lucide-react"
import { IoCloudDownloadOutline } from "react-icons/io5"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

const EnhancedInvestmentOverview = ({ data, selectedYear }) => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [modeFilter, setModeFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" })
  
  // Extract unique modes and statuses for filter options
  const uniqueModes = useMemo(() => {
    const modes = [...new Set(data?.map(item => item.mode) || [])]
    return modes
  }, [data])
  
  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(data?.map(item => item.status) || [])]
    return statuses
  }, [data])
  
  // Apply filters and sorting to data
  const filteredData = useMemo(() => {
    if (!data) return []
    
    return data
      .filter(item => {
        // Search term filter (case insensitive)
        const searchMatch = 
          searchTerm === "" || 
          item.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.voucherNo.toLowerCase().includes(searchTerm.toLowerCase())
        
        // Status filter
        const statusMatch = statusFilter === "all" || item.status === statusFilter
        
        // Mode filter
        const modeMatch = modeFilter === "all" || item.mode === modeFilter
        
        return searchMatch && statusMatch && modeMatch
      })
      .sort((a, b) => {
        if (sortConfig.key === "amount") {
          return sortConfig.direction === "asc" 
            ? a.amount - b.amount
            : b.amount - a.amount
        } else if (sortConfig.key === "date") {
          return sortConfig.direction === "asc"
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date)
        }
        // Default sort by date descending
        return new Date(b.date) - new Date(a.date)
      })
  }, [data, searchTerm, statusFilter, modeFilter, sortConfig])
  
  // Calculate totals for summary
  const summaryData = useMemo(() => {
    if (!filteredData.length) return { total: 0, count: 0 }
    
    const total = filteredData.reduce((sum, item) => sum + item.amount, 0)
    return {
      total,
      count: filteredData.length
    }
  }, [filteredData])
  
  // Request sort change
  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }
  
  // Status badge component
  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Cleared: "bg-green-100 text-green-800",
      Overdue: "bg-red-100 text-red-800",
    }
    return <Badge className={statusStyles[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>
  }

  // Download filtered report as PDF
  const downloadFilteredPDF = () => {
    const doc = new jsPDF()

    // Add headers
    doc.setFontSize(16)
    doc.text(`Investment Overview - ${selectedYear}`, 14, 15)

    // Add filter information
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22)
    
    if (statusFilter !== "all" || modeFilter !== "all" || searchTerm) {
      doc.text("Applied Filters:", 14, 28)
      let filterText = []
      if (statusFilter !== "all") filterText.push(`Status: ${statusFilter}`)
      if (modeFilter !== "all") filterText.push(`Mode: ${modeFilter}`)
      if (searchTerm) filterText.push(`Search: "${searchTerm}"`)
      doc.text(filterText.join(", "), 14, 34)
    }

    // Format table data
    const tableData = filteredData.map((item) => [
      new Date(item.date).toLocaleDateString(),
      item.investorName,
      item.voucherNo,
      new Date(item.submissionDate).toLocaleDateString(),
      item.mode,
      item.status,
      `$${item.amount.toFixed(2)}`,
    ])

    // Create table
    autoTable(doc, {
      head: [["Date", "Investor Name", "Voucher No.", "Submission Date", "Mode", "Status", "Amount"]],
      body: tableData,
      startY: statusFilter !== "all" || modeFilter !== "all" || searchTerm ? 40 : 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [51, 51, 51] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    })

    // Add summary information
    doc.setFontSize(12)
    const yPos = doc.internal.pageSize.height - 20
    doc.text(`Total Investments: ${summaryData.count} items`, 14, yPos - 10)
    doc.text(`Total Amount: $${summaryData.total.toFixed(2)}`, 14, yPos)

    // Save with appropriate filename
    let filename = `investment-overview-${selectedYear}`
    if (statusFilter !== "all") filename += `-${statusFilter}`
    if (modeFilter !== "all") filename += `-${modeFilter}`
    doc.save(`${filename}.pdf`)
  }

  // Download individual memo PDF
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
    
    doc.save(`IV-Memo-${item.voucherNo}.pdf`)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Investment Balance Overview</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={downloadFilteredPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by investor or voucher..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                {uniqueModes.map(mode => (
                  <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Summary info */}
        {filteredData.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredData.length} investments 
            {(statusFilter !== "all" || modeFilter !== "all" || searchTerm) && " with applied filters"} | 
            Total: ${summaryData.total.toFixed(2)}
          </div>
        )}
      </div>
      
      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => requestSort('date')}
              >
                Date {sortConfig.key === 'date' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead>Investor Name</TableHead>
              <TableHead>Voucher No.</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => requestSort('amount')}
              >
                Amount {sortConfig.key === 'amount' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No matching investments found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination or See More button */}
      {filteredData.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button variant="link" className="text-blue-600">
            See More
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default EnhancedInvestmentOverview