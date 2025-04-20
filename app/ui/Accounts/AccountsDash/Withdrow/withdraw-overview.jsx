"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ChevronRight, Filter, Search, BarChart2, TrendingUp, Calendar, AlertCircle, RefreshCw, DollarSign } from "lucide-react"
import { IoCloudDownloadOutline } from "react-icons/io5"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

const WithdrawOverview = ({ data, selectedYear }) => {
  // State for filters and analytics
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [modeFilter, setModeFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [timeframe, setTimeframe] = useState("monthly") // monthly, quarterly, yearly
  const [showDetailedView, setShowDetailedView] = useState(false)

  // Extract unique modes and statuses for filter options
  const uniqueModes = useMemo(() => [...new Set(data?.map(item => item.mode) || [])], [data])
  const uniqueStatuses = useMemo(() => [...new Set(data?.map(item => item.status) || [])], [data])

  // Apply filters and sorting to data
  const filteredData = useMemo(() => {
    if (!data) return []
    
    return data
      .filter(item => {
        const searchMatch = 
          searchTerm === "" || 
          item.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.voucherNo.toLowerCase().includes(searchTerm.toLowerCase())
        
        const statusMatch = statusFilter === "all" || item.status === statusFilter
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
        return new Date(b.date) - new Date(a.date)
      })
  }, [data, searchTerm, statusFilter, modeFilter, sortConfig])

  // Request sort handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Calculate totals for summary
  const summaryData = useMemo(() => {
    if (!filteredData.length) return { total: 0, count: 0 }
    
    const total = filteredData.reduce((sum, item) => sum + item.amount, 0)
    return { total, count: filteredData.length }
  }, [filteredData])

  // Time-based grouping
  const timeBasedData = useMemo(() => {
    const groupedData = {}
    
    filteredData.forEach(item => {
      const date = new Date(item.date)
      let key
      
      if (timeframe === "monthly") {
        key = `${date.getMonth() + 1}/${date.getFullYear()}`
      } else if (timeframe === "quarterly") {
        const quarter = Math.floor(date.getMonth() / 3) + 1
        key = `Q${quarter}/${date.getFullYear()}`
      } else {
        key = date.getFullYear().toString()
      }
      
      if (!groupedData[key]) {
        groupedData[key] = { total: 0, count: 0 }
      }
      
      groupedData[key].total += item.amount
      groupedData[key].count += 1
    })
    
    return Object.entries(groupedData)
      .sort((a, b) => {
        if (timeframe === "monthly") {
          const [monthA, yearA] = a[0].split('/').map(Number)
          const [monthB, yearB] = b[0].split('/').map(Number)
          return yearB - yearA || monthB - monthA
        } else if (timeframe === "quarterly") {
          const qA = a[0].match(/Q(\d)\/(\d{4})/)
          const qB = b[0].match(/Q(\d)\/(\d{4})/)
          if (qA && qB) {
            return Number(qB[2]) - Number(qA[2]) || Number(qB[1]) - Number(qA[1])
          }
          return 0
        } else {
          return Number(b[0]) - Number(a[0])
        }
      })
      .slice(0, 12)
  }, [filteredData, timeframe])

  // Status badge component
  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Cleared: "bg-green-100 text-green-800",
      Overdue: "bg-red-100 text-red-800",
    };
    return <Badge className={statusStyles[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>;
  };

  // Download filtered report as PDF
  const downloadFilteredPDF = () => {
    const doc = new jsPDF();
  
    // Add headers
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Withdraw Overview - ${selectedYear}`, 14, 15);
  
    // Add timestamp
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
  
    // Add filter information
    if (statusFilter !== "all" || modeFilter !== "all" || searchTerm) {
      doc.setFontSize(10);
      doc.text("Applied Filters:", 14, 28);
      let filterText = [];
      if (statusFilter !== "all") filterText.push(`Status: ${statusFilter}`);
      if (modeFilter !== "all") filterText.push(`Mode: ${modeFilter}`);
      if (searchTerm) filterText.push(`Search: "${searchTerm}"`);
      doc.text(filterText.join(", "), 14, 34);
    }
  
    // Add analytics section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Withdraw Analytics", 14, 40);
  
    // Summary metrics
    const summaryMetrics = [
      ["Total Withdraws", `$${summaryData.total.toFixed(2)}`],
      ["Total Investors", `${summaryData.count}`],
    ];
  
    autoTable(doc, {
      head: [["Metric", "Value"]],
      body: summaryMetrics,
      startY: 45,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [51, 51, 51] },
    });
  
    // Time-based analysis
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Time-Based Analysis", 14, doc.lastAutoTable.finalY + 15);
  
    const timeBasedTableData = timeBasedData.map(([period, data]) => [
      period,
      `$${data.total.toFixed(2)}`,
      `${data.count}`,
    ]);
  
    autoTable(doc, {
      head: [["Period", "Total Amount", "Count"]],
      body: timeBasedTableData,
      startY: doc.lastAutoTable.finalY + 20,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [51, 51, 51] },
    });
  
    // Add transactions table
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Details", 14, doc.lastAutoTable.finalY + 15);
  
    const tableData = filteredData.map((item) => [
      new Date(item.date).toLocaleDateString(),
      item.investorName,
      item.voucherNo,
      new Date(item.submissionDate).toLocaleDateString(),
      item.mode,
      item.status,
      `$${item.amount.toFixed(2)}`,
    ]);
  
    autoTable(doc, {
      head: [["Date", "Withdrawer", "Voucher No.", "Submission Date", "Mode", "Status", "Amount"]],
      body: tableData,
      startY: doc.lastAutoTable.finalY + 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [51, 51, 51] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
  
    // Add recommendations section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Management Recommendations:", 14, doc.lastAutoTable.finalY + 15);
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
  
    let recommendations = [];
    if (summaryData.total === 0) {
      recommendations.push("• No Withdraws found for the selected filters.");
    } else {
      if (statusFilter === "Overdue") {
        recommendations.push("• High overdue Withdraws detected. Follow up with investors immediately.");
      }
      if (statusFilter === "Pending") {
        recommendations.push("• Review pending Withdraws and ensure timely clearance.");
      }
      if (timeBasedData.length > 0) {
        const latestPeriod = timeBasedData[0][0];
        const latestData = timeBasedData[0][1];
        recommendations.push(`• Latest period (${latestPeriod}) had ${latestData.count} Withdraws totaling $${latestData.total.toFixed(2)}.`);
      }
    }
  
    recommendations.forEach((rec, i) => {
      doc.text(rec, 14, doc.lastAutoTable.finalY + 20 + (i * 5));
    });
  
    // Save with appropriate filename
    let filename = `Withdraw-overview-${selectedYear}`;
    if (statusFilter !== "all") filename += `-${statusFilter}`;
    if (modeFilter !== "all") filename += `-${modeFilter}`;
    doc.save(`${filename}.pdf`);
  };

  // Download individual memo PDF
  const downloadWithdrawalPDF = (withdrawalData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
    const margin = 20;

    // Add header image (same as income invoice)
    const imgHeight = 37;
    const imgWidth = pageWidth;
    doc.addImage('https://i.postimg.cc/pL8JPH0b/Screenshot-from-2025-04-20-10-23-28.png', 'PNG', 0, 0, imgWidth, imgHeight);

    // WITHDRAWAL VOUCHER header
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("WITHDRAWAL INVOICE", centerX, 50, { align: "center" });

    // Format date (same as invoice)
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, '.');
    };

    // Withdrawal info section
    const withdrawalInfo = [
      ["CLIENT:", withdrawalData.investorName || "N/A"],
      ["VOUCHER NO:", withdrawalData.voucherNo || "N/A"],
      ["DATE:", formatDate(withdrawalData.date || new Date())],
      ["PAYMENT METHOD:", withdrawalData.mode || "N/A"],
      ["STATUS:", withdrawalData.status || "N/A"]
    ];

    let yPos = 70;
    withdrawalInfo.forEach(([label, value]) => {
      doc.setFontSize(10);
      if (label) {
        doc.setFont("helvetica", "bold");
        doc.text(label, margin, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(value, margin + 35, yPos);
      } else {
        doc.text(value, margin + 35, yPos);
      }
      yPos += 5;
    });

    yPos += 10;

    // Withdrawal items table (single item like invoice)
    const items = [{
        item: 1,
        description: withdrawalData.description || "Funds Withdrawal",
        value: withdrawalData.amount || 0
    }];

    const tableColumns = [
      { header: 'No.', dataKey: 'item', width: 15 },
      { header: 'Description', dataKey: 'description', width: 60 },
      { header: 'Amount', dataKey: 'value', width: 25 }
    ];

    autoTable(doc, {
      startY: yPos,
      head: [tableColumns.map(col => col.header)],
      body: items.map(item => [item.item, item.description, item.value]),
      columnStyles: {
        'No.': { cellWidth: 15 },
        'Description': { cellWidth: 60 },
        'Amount': { cellWidth: 25 }
      },
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { 
        fillColor: [220, 220, 220], 
        textColor: [0, 0, 0], 
        fontStyle: 'bold' 
      }
    });

    // Calculate total (single item but matches invoice structure)
    const total = items.reduce((sum, item) => sum + item.value, 0);

    // Add totals below the table (same as invoice)
    yPos = doc.lastAutoTable.finalY + 10;

    // Total row
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total Withdrawal:", pageWidth - margin - 60, yPos, { align: "right" });
    doc.text(total.toFixed(2), pageWidth - margin, yPos, { align: "right" });
    doc.text("QR", pageWidth - margin + 30, yPos);
    yPos += 10;

    // Amount in words (same format as invoice)
    const amountInWords = numberToWords(total) + " RIAL & " + 
                          Math.round((total % 1) * 100) + " DIRHAMS";
    doc.setFontSize(10);
    doc.text(`AMOUNT IN WORDS: ${amountInWords.toUpperCase()}`, margin, yPos);
    yPos += 15;

    // Payment details (modified for withdrawal)
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT DETAILS", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    const paymentDetails = [
      `PAYMENT METHOD: ${withdrawalData.mode || "N/A"}`,
      `REFERENCE NUMBER: ${withdrawalData.referenceNo || "N/A"}`,
      `PROCESSED DATE: ${formatDate(withdrawalData.processedDate || new Date())}`,
      `APPROVED BY: ${withdrawalData.approvedBy || "System"}`
    ];

    paymentDetails.forEach(detail => {
      doc.text(detail, margin, yPos);
      yPos += 5;
    });

    // Footer with signature (same as invoice)
    yPos += 25;
    doc.line(pageWidth - margin - 50, yPos - 4, pageWidth - margin, yPos - 4);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Authorised Signature", pageWidth - margin - 10, yPos, { align: "right" });

    // Footer note (same style as invoice)
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(
      "This is an electronically generated withdrawal voucher. No signature required",
      centerX,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    doc.save(`EAGLE_WDL_${withdrawalData.voucherNo}.pdf`);
};

function numberToWords(num) {
  const units = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];
  const teens = ["TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"];
  const tens = ["", "TEN", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];
  
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num % 1) * 100);
  
  if (integerPart === 0) return "ZERO";
  if (integerPart < 10) return units[integerPart];
  if (integerPart < 20) return teens[integerPart - 10];
  if (integerPart < 100) {
    return tens[Math.floor(integerPart / 10)] + 
           (integerPart % 10 !== 0 ? " " + units[integerPart % 10] : "");
  }
  if (integerPart < 1000) {
    return units[Math.floor(integerPart / 100)] + " HUNDRED" + 
           (integerPart % 100 !== 0 ? " AND " + numberToWords(integerPart % 100) : "");
  }
  if (integerPart < 100000) {
    return numberToWords(Math.floor(integerPart / 1000)) + " THOUSAND" + 
           (integerPart % 1000 !== 0 ? " " + numberToWords(integerPart % 1000) : "");
  }
  
  return "NUMBER TOO LARGE";
}

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Withdraw Overview</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={downloadFilteredPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" onClick={() => setShowDetailedView(!showDetailedView)}>
            <BarChart2 className="w-4 h-4 mr-2" />
            {showDetailedView ? "Hide Analytics" : "Show Analytics"}
          </Button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showDetailedView && (
        <div className="space-y-6 mb-5">
          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Withdraws</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-2xl font-bold">${summaryData.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Investors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-2xl font-bold">{summaryData.count}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time-based analysis */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle>Withdraw Analysis</CardTitle>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={timeframe === "monthly" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setTimeframe("monthly")}
                >
                  Monthly
                </Button>
                <Button 
                  variant={timeframe === "quarterly" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setTimeframe("quarterly")}
                >
                  Quarterly
                </Button>
                <Button 
                  variant={timeframe === "yearly" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setTimeframe("yearly")}
                >
                  Yearly
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Period</th>
                      <th className="text-right py-2">Total</th>
                      <th className="text-right py-2">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeBasedData.map(([period, data]) => (
                      <tr key={period} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-medium">{period}</td>
                        <td className="text-right py-2">${data.total.toFixed(2)}</td>
                        <td className="text-right py-2">{data.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
            Showing {filteredData.length} Withdraws 
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
                Date {sortConfig?.key === 'date' && (
                  <span>{sortConfig?.direction === 'asc' ? '↑' : '↓'}</span>
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
                  No matching Withdraws found
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
                    <Button variant="ghost" size="icon" onClick={() => downloadWithdrawalPDF(item)}>
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

export default WithdrawOverview