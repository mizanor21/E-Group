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
  title = "Income Overview",
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

  const downloadInvoicePDF = (invoiceData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
    const margin = 20;
  
    // Add header image
    const imgHeight = 37;
    const imgWidth = pageWidth;
    doc.addImage('https://i.postimg.cc/pL8JPH0b/Screenshot-from-2025-04-20-10-23-28.png', 'PNG', 0, 0, imgWidth, imgHeight);
  
    // INVOICE header
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("INVOICE", centerX, 50, { align: "center" });
  
    // Format date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, '.');
    };
  
    // Invoice info section
    const invoiceInfo = [
      ["TO:", invoiceData.customerName || "N/A"],
      ["INVOICE NUMBER:", invoiceData.voucherNo || "N/A"],
      ["INVOICE DATE:", formatDate(invoiceData.submissionDate || new Date())],
    ];
  
    let yPos = 70;
    invoiceInfo.forEach(([label, value]) => {
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
  
    // Invoice items table
    const items = invoiceData.items || [
      {
        item: 1,
        description: invoiceData.description || "Genaral",
        value: invoiceData.amount || 0
      }
    ];
  
    const tableColumns = [
      { header: 'Item', dataKey: 'item', width: 15 },
      { header: 'Description', dataKey: 'description', width: 60 },
      { header: 'Value', dataKey: 'value', width: 25 }
    ];
  
    autoTable(doc, {
      startY: yPos,
      head: [tableColumns.map(col => col.header)],
      body: items.map(item => tableColumns.map(col => item[col.dataKey.toLowerCase()])),
      columnStyles: tableColumns.reduce((acc, col) => {
        acc[col.header] = { cellWidth: col.width };
        return acc;
      }, {}),
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' }
    });
  
    // Calculate totals
    const subTotal = items.reduce((sum, item) => sum + item.value, 0);
    const discountPercent = invoiceData.discountPercent || 3;
    const discount = subTotal * (discountPercent / 100);
    const total = subTotal - discount;
  
    // Add totals below the table
    yPos = doc.lastAutoTable.finalY + 10;
  
    // Subtotal row
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Sub Total Amount", pageWidth - margin - 60, yPos, { align: "right" });
    doc.text(subTotal.toFixed(2), pageWidth - margin, yPos, { align: "right" });
    yPos += 5;
  
    // Discount row
    doc.text(`Special Discount for Quick Pay @${discountPercent}% of Invoice Value`, 
             pageWidth - margin - 60, yPos, { align: "right" });
    doc.text(discount.toFixed(2), pageWidth - margin, yPos, { align: "right" });
    yPos += 5;
  
    // Total row
    doc.setFontSize(12);
    doc.text("Total Amount:", pageWidth - margin - 60, yPos, { align: "right" });
    doc.text(total.toFixed(2), pageWidth - margin, yPos, { align: "right" });
    doc.text("QR", pageWidth - margin + 30, yPos);
    yPos += 10;
  
    // Amount in words
    const amountInWords = numberToWords(total) + " RIAL & " + 
                          Math.round((total % 1) * 100) + " DIRHAMS";
    doc.setFontSize(10);
    doc.text(`AMOUNT IN WORD : ${amountInWords.toUpperCase()}`, margin, yPos);
    yPos += 15;
  
    // Notes section
    doc.text("NOTE:", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.text("1. PLEASE MAKE PAYMENT BY TT WITHIN 3 (THREE) DAYS UPON ISSUED THE INVOICE.", margin + 5, yPos);
    yPos += 5;
    doc.text("2. DETAILS OF THE MANPOWER IS GIVEN IN ENCLOSED FILE.", margin + 5, yPos);
    yPos += 10;
  
    // Bank details
    doc.setFont("helvetica", "bold");
    doc.text("BANK ACCOUNT DETAILS", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    const bankDetails = [
      `BANK NAME: ${invoiceData.bankName || "QATAR NATIONAL BANK"}`,
      `A/C NAME: ${invoiceData.accountName || "EAGLE FOR TRADING AND EMPLOYMENT"}`,
      `SWIFT BOX: ${invoiceData.swiftCode || "QMBQ0QA000"}`,
      `BANK A/C NO: ${invoiceData.accountNumber || "Q25205720001"}`,
      `IBAN NO: ${invoiceData.iban || "QABBQ0BA00000000252057320001"}`
    ];
  
    bankDetails.forEach(detail => {
      doc.text(detail, margin, yPos);
      yPos += 5;
    });
  
    // Footer with signature
    yPos += 45;
    doc.line(pageWidth - margin - 50, yPos - 4, pageWidth - margin, yPos - 4); // Add underline
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Authorised Signature", pageWidth - margin - 10, yPos, { align: "right" });
  
    // Footer note
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(
      "This is an electronically generated invoice. No signature required",
      centerX,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  
    doc.save(`EAGLE_IN_Invoice-${invoiceData.voucherNo}.pdf`);
  };
  
  // Helper function to convert numbers to words (you may need a more comprehensive implementation)
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
                    <Button variant="ghost" size="icon" onClick={() => downloadInvoicePDF(item)}>
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