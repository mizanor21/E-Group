"use client";

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
import { Download, Edit2, ChevronRight } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { IoCloudDownloadOutline } from "react-icons/io5";

const ExpensesOverview = ({ data, selectedYear }) => {
  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Cleared: "bg-green-100 text-green-800",
      Overdue: "bg-red-100 text-red-800",
    };
    return <Badge className={statusStyles[status]}>{status}</Badge>;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Expenses Overview - ${selectedYear}`, 14, 15);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    const tableData = data?.map((item) => [
      new Date(item.date).toLocaleDateString(),
      item.expenseCategory,
      item.voucherNo,
      new Date(item.issueDate).toLocaleDateString(),
      item.paymentMethod,
      item.status,
      `$${item.amount.toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [
        [
          "Date",
          "Category",
          "Voucher No.",
          "Issue Date",
          "Payment Method",
          "Status",
          "Amount",
        ],
      ],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [51, 51, 51] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    const totalAmount = data?.reduce((sum, item) => sum + item.amount, 0) || 0;
    doc.setFontSize(12);
    doc.text(
      `Total Expenses: $${totalAmount.toFixed(2)}`,
      14,
      doc.internal.pageSize.height - 20
    );

    doc.save(`expenses-overview-${selectedYear}.pdf`);
  };

  const downloadMemoPDF = (invoiceData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
    const margin = 20;

    // Add header image (same as invoice)
    const imgHeight = 37;
    const imgWidth = pageWidth;
    doc.addImage('https://i.postimg.cc/pL8JPH0b/Screenshot-from-2025-04-20-10-23-28.png', 'PNG', 0, 0, imgWidth, imgHeight);

    // EXPENSE VOUCHER header
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("EXPENSE INVOICE", centerX, 50, { align: "center" });

    // Format date (same as invoice)
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, '.');
    };

    // Expense info section
    const expenseInfo = [
      ["PAID TO:", invoiceData.customerName || "N/A"],
      ["VOUCHER NUMBER:", invoiceData.voucherNo || "N/A"],
      ["DATE:", formatDate(invoiceData.submissionDate || new Date())],
      ["CATEGORY:", invoiceData.expenseCategory || "General"],
      ["PAYMENT METHOD:", invoiceData.mode || "N/A"],
    ];

    let yPos = 70;
    expenseInfo.forEach(([label, value]) => {
      doc.setFontSize(10);
      if (label) {
        doc.setFont("helvetica", "bold");
        doc.text(label, margin, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(value, margin + 45, yPos);
      } else {
        doc.text(value, margin + 45, yPos);
      }
      yPos += 5;
    });

    yPos += 10;

    // Expense items table
    const items = invoiceData.items || [
      {
        item: 1,
        description: invoiceData.description || "General Expense",
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
    const taxPercent = invoiceData.taxPercent || 0;
    const tax = subTotal * (taxPercent / 100);
    const total = subTotal + tax;

    // Add totals below the table
    yPos = doc.lastAutoTable.finalY + 10;

    // Subtotal row
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Sub Total Amount", pageWidth - margin - 60, yPos, { align: "right" });
    doc.text(subTotal.toFixed(2), pageWidth - margin, yPos, { align: "right" });
    yPos += 5;

    // Tax row (if applicable)
    if (taxPercent > 0) {
      doc.text(`Tax @${taxPercent}%`, pageWidth - margin - 60, yPos, { align: "right" });
      doc.text(tax.toFixed(2), pageWidth - margin, yPos, { align: "right" });
      yPos += 5;
    }

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
    doc.text("1. THIS DOCUMENT SERVES AS AN OFFICIAL EXPENSE RECORD.", margin + 5, yPos);
    yPos += 5;
    doc.text("2. PLEASE RETAIN THIS VOUCHER FOR YOUR RECORDS.", margin + 5, yPos);
    yPos += 10;

    // Payment details
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT DETAILS", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    const paymentDetails = [
      `PAYMENT METHOD: ${invoiceData.mode || "N/A"}`,
      `REFERENCE NUMBER: ${invoiceData.referenceNo || "N/A"}`,
      `PAYMENT DATE: ${formatDate(invoiceData.paymentDate || new Date())}`,
      `PAID BY: ${invoiceData.paidBy || "N/A"}`
    ];

    paymentDetails.forEach(detail => {
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
      "This is an electronically generated expense voucher. No signature required",
      centerX,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    doc.save(`EAGLE_Expense-${invoiceData.voucherNo}.pdf`);
};

const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  function convertLessThanOneThousand(num) {
    if (num === 0) return '';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    }
    return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + convertLessThanOneThousand(num % 100) : '');
  }
  
  if (num === 0) return 'Zero';
  let result = '';
  const billion = Math.floor(num / 1000000000);
  num %= 1000000000;
  const million = Math.floor(num / 1000000);
  num %= 1000000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  
  if (billion > 0) result += convertLessThanOneThousand(billion) + ' Billion ';
  if (million > 0) result += convertLessThanOneThousand(million) + ' Million ';
  if (thousand > 0) result += convertLessThanOneThousand(thousand) + ' Thousand ';
  result += convertLessThanOneThousand(num);
  
  return result.trim();
};


  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Expenses Overview
        </h1>
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
              <TableHead>Customer</TableHead>
              <TableHead>Voucher No.</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item, index) => (
              <TableRow key={index}>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadMemoPDF(item)}
                  >
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
  );
};

export default ExpensesOverview;
