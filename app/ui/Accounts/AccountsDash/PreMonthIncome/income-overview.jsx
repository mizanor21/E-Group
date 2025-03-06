"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  ChevronRight, 
  Filter,
  TrendingUp,
  DollarSign,
  BarChart2,
  Calendar,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const SmartIncomeManagement = ({
  data = [],
  title = "Smart Income Management",
  selectedYear = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [timeframe, setTimeframe] = useState("monthly"); // monthly, quarterly, yearly
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Filter and sort data
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const matchesSearch = 
          item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.mode.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "All" || item.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortConfig.key === "amount") {
          return sortConfig.direction === "asc" 
            ? a.amount - b.amount 
            : b.amount - a.amount;
        } else if (sortConfig.key === "date") {
          return sortConfig.direction === "asc" 
            ? new Date(a.date) - new Date(b.date) 
            : new Date(b.date) - new Date(a.date);
        } else {
          return sortConfig.direction === "asc" 
            ? a[sortConfig.key].localeCompare(b[sortConfig.key])
            : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        }
      });
  }, [data, searchTerm, statusFilter, sortConfig]);

  // Request sort handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Cleared: "bg-green-100 text-green-800",
      Overdue: "bg-red-100 text-red-800",
    };
    return <Badge className={statusStyles[status]}>{status}</Badge>;
  };

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0) || 0;
    const pendingAmount = data.filter(item => item.status === "Pending")
      .reduce((sum, item) => sum + item.amount, 0) || 0;
    const clearedAmount = data.filter(item => item.status === "Cleared")
      .reduce((sum, item) => sum + item.amount, 0) || 0;
    const overdueAmount = data.filter(item => item.status === "Overdue")
      .reduce((sum, item) => sum + item.amount, 0) || 0;

    // Group by payment mode
    const paymentModes = {};
    data.forEach(item => {
      paymentModes[item.mode] = (paymentModes[item.mode] || 0) + item.amount;
    });

    // Group by customer
    const customers = {};
    data.forEach(item => {
      customers[item.customerName] = (customers[item.customerName] || 0) + item.amount;
    });

    // Sort customers by amount
    const topCustomers = Object.entries(customers)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Calculate average transaction value
    const avgTransactionValue = totalAmount / (data.length || 1);

    // Calculate clearance ratio
    const clearanceRatio = (clearedAmount / totalAmount) * 100 || 0;

    return {
      totalAmount,
      pendingAmount,
      clearedAmount,
      overdueAmount,
      paymentModes,
      topCustomers,
      avgTransactionValue,
      clearanceRatio,
      overdueRatio: (overdueAmount / totalAmount) * 100 || 0,
    };
  }, [data]);

  // Time-based grouping
  const timeBasedData = useMemo(() => {
    const groupedData = {};
    
    data.forEach(item => {
      const date = new Date(item.date);
      let key;
      
      if (timeframe === "monthly") {
        key = `${date.getMonth() + 1}/${date.getFullYear()}`;
      } else if (timeframe === "quarterly") {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `Q${quarter}/${date.getFullYear()}`;
      } else {
        key = date.getFullYear().toString();
      }
      
      if (!groupedData[key]) {
        groupedData[key] = { total: 0, cleared: 0, pending: 0, overdue: 0, count: 0 };
      }
      
      groupedData[key].total += item.amount;
      groupedData[key].count += 1;
      
      if (item.status === "Cleared") {
        groupedData[key].cleared += item.amount;
      } else if (item.status === "Pending") {
        groupedData[key].pending += item.amount;
      } else if (item.status === "Overdue") {
        groupedData[key].overdue += item.amount;
      }
    });
    
    return Object.entries(groupedData)
      .sort((a, b) => {
        if (timeframe === "monthly") {
          const [monthA, yearA] = a[0].split('/').map(Number);
          const [monthB, yearB] = b[0].split('/').map(Number);
          return yearB - yearA || monthB - monthA;
        } else if (timeframe === "quarterly") {
          const qA = a[0].match(/Q(\d)\/(\d{4})/);
          const qB = b[0].match(/Q(\d)\/(\d{4})/);
          if (qA && qB) {
            return Number(qB[2]) - Number(qA[2]) || Number(qB[1]) - Number(qA[1]);
          }
          return 0;
        } else {
          return Number(b[0]) - Number(a[0]);
        }
      })
      .slice(0, 12);
  }, [data, timeframe]);

  // Generate overall report
  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Add title and header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`${title} - ${selectedYear}`, 14, 15);
  
    // Add timestamp
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
  
    // Calculate analytics for filtered data
    const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0) || 0;
    const pendingAmount = filteredData.filter(item => item.status === "Pending")
      .reduce((sum, item) => sum + item.amount, 0) || 0;
    const clearedAmount = filteredData.filter(item => item.status === "Cleared")
      .reduce((sum, item) => sum + item.amount, 0) || 0;
    const overdueAmount = filteredData.filter(item => item.status === "Overdue")
      .reduce((sum, item) => sum + item.amount, 0) || 0;
  
    // Group by payment mode for filtered data
    const paymentModes = {};
    filteredData.forEach(item => {
      paymentModes[item.mode] = (paymentModes[item.mode] || 0) + item.amount;
    });
  
    // Group by customer for filtered data
    const customers = {};
    filteredData.forEach(item => {
      customers[item.customerName] = (customers[item.customerName] || 0) + item.amount;
    });
  
    // Sort customers by amount
    const topCustomers = Object.entries(customers)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  
    // Calculate average transaction value
    const avgTransactionValue = totalAmount / (filteredData.length || 1);
  
    // Calculate clearance ratio
    const clearanceRatio = (clearedAmount / totalAmount) * 100 || 0;
  
    // Add summary section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Financial Summary", 14, 30);
    
    // Summary metrics
    const summaryData = [
      ["Total Income", `$${totalAmount.toFixed(2)}`],
      ["Cleared Amount", `$${clearedAmount.toFixed(2)} (${clearanceRatio.toFixed(1)}%)`],
      ["Pending Amount", `$${pendingAmount.toFixed(2)}`],
      ["Overdue Amount", `$${overdueAmount.toFixed(2)}`],
      ["Average Transaction Value", `$${avgTransactionValue.toFixed(2)}`],
    ];
  
    autoTable(doc, {
      head: [["Metric", "Value"]],
      body: summaryData,
      startY: 35,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [51, 51, 51] },
    });
  
    // Top customers section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Top Customers", 14, doc.lastAutoTable.finalY + 15);
  
    const customerData = topCustomers.map(([name, amount]) => [
      name, `$${amount.toFixed(2)}`
    ]);
  
    autoTable(doc, {
      head: [["Customer", "Total Amount"]],
      body: customerData,
      startY: doc.lastAutoTable.finalY + 20,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [51, 51, 51] },
    });
  
    // Payment modes section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Methods", 14, doc.lastAutoTable.finalY + 15);
  
    const paymentData = Object.entries(paymentModes).map(([mode, amount]) => [
      mode, `$${amount.toFixed(2)}`
    ]);
  
    autoTable(doc, {
      head: [["Payment Method", "Total Amount"]],
      body: paymentData,
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
      item.customerName,
      item.voucherNo,
      item.mode,
      item.status,
      `$${item.amount.toFixed(2)}`,
    ]);
  
    autoTable(doc, {
      head: [["Date", "Customer", "Voucher No.", "Mode", "Status", "Amount"]],
      body: tableData,
      startY: doc.lastAutoTable.finalY + 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [51, 51, 51] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
  
    // Footer with recommendations
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Management Recommendations:", 14, doc.lastAutoTable.finalY + 15);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    let recommendations = [];
    const overdueRatio = (overdueAmount / totalAmount) * 100 || 0;
    if (overdueRatio > 15) {
      recommendations.push("• High overdue ratio detected. Implement immediate collection strategy.");
    } else if (overdueRatio > 5) {
      recommendations.push("• Consider reviewing payment terms for customers with overdue balances.");
    }
    
    if (clearanceRatio < 70) {
      recommendations.push("• Clearance ratio below target. Review collection process efficiency.");
    } else if (clearanceRatio > 90) {
      recommendations.push("• Excellent clearance ratio. Consider offering extended terms to top customers.");
    }
    
    recommendations.forEach((rec, i) => {
      doc.text(rec, 14, doc.lastAutoTable.finalY + 20 + (i * 5));
    });
  
    doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}-${selectedYear}-filtered.pdf`);
  };

  // Generate individual voucher PDF
  const downloadMemoPDF = (item) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;

    // Modern header with dark background
    doc.setFillColor(33, 37, 41);
    doc.rect(0, 0, pageWidth, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("E-Group", 14, 20);

    // Expense title
    doc.setTextColor(33, 37, 41);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Income Voucher", centerX, 45, { align: "center" });

    // Format dates for display
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const expenseDate = formatDate(item.date);
    const issueDate = formatDate(item.issueDate);
    const submissionDate = formatDate(item.submissionDate);
    const dueDate = formatDate(item.dueDate);

    // Key information section - expense details
    doc.roundedRect(14, 55, pageWidth - 28, 110, 3, 3);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Income Details", 20, 70);

    // Main expense info
    const expenseData = [
      ["Customer", item.customerName],
      ["Voucher No", item.voucherNo],
      ["Category", item.expenseCategory || "General"],
      ["Payment Method", item.mode],
      ["Issue Date", issueDate],
      ["Submission Date", submissionDate],
      ["Due Date", dueDate],
      ["Status", item.status],
    ];

    autoTable(doc, {
      startY: 75,
      margin: { left: 20, right: 20 },
      tableWidth: pageWidth - 40,
      theme: "grid",
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [33, 37, 41],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 6,
        lineColor: [200, 200, 200],
      },
      body: expenseData,
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 80 },
        1: { cellWidth: pageWidth - 120 },
      },
    });

    // Amount section with highlight - using blue for income
    doc.setFillColor(13, 110, 253); // Bootstrap primary blue
    doc.roundedRect(14, 175, pageWidth - 28, 45, 3, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Total Income:", 25, 200);

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(`$${item.amount.toFixed(2)}`, pageWidth - 25, 200, {
      align: "right",
    });

    // Reference information section
    doc.setTextColor(33, 37, 41);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Additional Information", 20, 240);

    doc.setDrawColor(220, 220, 220);
    doc.line(20, 245, pageWidth - 20, 245);

    const referenceData = [
      ["Transaction ID:", `TXN-${item.voucherNo}`],
      ["Created:", new Date(item.createdAt || Date.now()).toLocaleString()],
    ];

    autoTable(doc, {
      startY: 250,
      margin: { left: 20, right: 20 },
      tableWidth: pageWidth - 40,
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 3 },
      body: referenceData,
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 80 },
        1: { cellWidth: pageWidth - 120 },
      },
    });

    // Payment verification seal for cleared items
    if (item.status === "Cleared") {
      doc.setDrawColor(0, 128, 0);
      doc.setLineWidth(2);
      doc.circle(pageWidth - 40, 50, 15);
      
      doc.setTextColor(0, 128, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("PAID", pageWidth - 40, 50, { align: "center" });
    }

    // Footer
    doc.setFillColor(240, 240, 240);
    doc.rect(0, doc.internal.pageSize.getHeight() - 25, pageWidth, 25, "F");

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(
      "This is an electronically generated receipt. No signature required",
      centerX,
      doc.internal.pageSize.getHeight() - 15,
      { align: "center" }
    );
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      centerX,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    doc.save(`IN-Memo-${item.voucherNo}.pdf`);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-gray-500">Financial Year: {selectedYear}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={downloadPDF}>
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
        <div className="space-y-6">
          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-2xl font-bold">${analytics.totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Clearance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-2xl font-bold">{analytics.clearanceRatio.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-yellow-500" />
                  <span className="text-2xl font-bold">${analytics.pendingAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                  <span className="text-2xl font-bold">${analytics.overdueAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time-based analysis */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle>Income Analysis</CardTitle>
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
                      <th className="text-right py-2">Cleared</th>
                      <th className="text-right py-2">Pending</th>
                      <th className="text-right py-2">Overdue</th>
                      <th className="text-right py-2">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeBasedData.map(([period, data]) => (
                      <tr key={period} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-medium">{period}</td>
                        <td className="text-right py-2">${data.total.toFixed(2)}</td>
                        <td className="text-right py-2 text-green-600">${data.cleared.toFixed(2)}</td>
                        <td className="text-right py-2 text-yellow-600">${data.pending.toFixed(2)}</td>
                        <td className="text-right py-2 text-red-600">${data.overdue.toFixed(2)}</td>
                        <td className="text-right py-2">{data.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Customer analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.topCustomers.map(([name, amount], index) => (
                    <div key={index} className="flex justify-between items-center py-1 border-b last:border-0">
                      <span className="font-medium">{name}</span>
                      <span>${amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(analytics.paymentModes).map(([mode, amount], index) => (
                    <div key={index} className="flex justify-between items-center py-1 border-b last:border-0">
                      <span className="font-medium">{mode}</span>
                      <span>${amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by customer, voucher or payment mode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-1">
            <Button 
              variant={statusFilter === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("All")}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === "Cleared" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("Cleared")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Cleared
            </Button>
            <Button 
              variant={statusFilter === "Pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("Pending")}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Pending
            </Button>
            <Button 
              variant={statusFilter === "Overdue" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("Overdue")}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Overdue
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={() => {
            setSearchTerm("");
            setStatusFilter("All");
          }}>
            <RefreshCw className="w-3 h-3 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => requestSort("date")}
              >
                Date {sortConfig.key === "date" && (
                  sortConfig.direction === "asc" ? " ↑" : " ↓"
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => requestSort("customerName")}
              >
                Customer {sortConfig.key === "customerName" && (
                  sortConfig.direction === "asc" ? " ↑" : " ↓"
                )}
              </TableHead>
              <TableHead>Voucher No.</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => requestSort("mode")}
              >
                Mode {sortConfig.key === "mode" && (
                  sortConfig.direction === "asc" ? " ↑" : " ↓"
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => requestSort("status")}
              >
                Status {sortConfig.key === "status" && (
                  sortConfig.direction === "asc" ? " ↑" : " ↓"
                )}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => requestSort("amount")}
              >
                Amount {sortConfig.key === "amount" && (
                  sortConfig.direction === "asc" ? " ↑" : " ↓"
                )}
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TableRow key={index} className={
                  item.status === "Overdue" ? "bg-red-50" :
                  item.status === "Pending" && new Date(item.dueDate) < new Date() ? "bg-yellow-50" :
                  ""
                }>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.customerName}</TableCell>
                  <TableCell>{item.voucherNo}</TableCell>
                  <TableCell>
                    {new Date(item.issueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(item.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(item.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.mode}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${item.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => downloadMemoPDF(item)}>
                      <IoCloudDownloadOutline className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-6 text-gray-500">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SmartIncomeManagement;