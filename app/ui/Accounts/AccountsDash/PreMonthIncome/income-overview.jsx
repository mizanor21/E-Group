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

const IncomeOverview = ({
  data,
  title = "Income Balance Overview",
  selectedYear,
}) => {
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

    // Add title
    doc.setFontSize(16);
    doc.text(`${title} - ${selectedYear}`, 14, 15);

    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    // Create table data
    const tableData = data?.map((item) => [
      new Date(item.date).toLocaleDateString(),
      item.customerName,
      item.voucherNo,
      new Date(item.issueDate).toLocaleDateString(),
      item.mode,
      item.status,
      `$${item.amount.toFixed(2)}`,
    ]);

    // Add table
    autoTable(doc, {
      head: [
        [
          "Date",
          "Customer",
          "Voucher No.",
          "Issue Date",
          "Mode",
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

    // Add summary
    const totalAmount = data?.reduce((sum, item) => sum + item.amount, 0) || 0;
    doc.setFontSize(12);
    doc.text(
      `Total Amount: $${totalAmount.toFixed(2)}`,
      14,
      doc.internal.pageSize.height - 20
    );

    doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}-${selectedYear}.pdf`);
  };

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

    // Amount section with highlight - using red for expenses
    doc.setFillColor(40, 167, 69); // Bootstrap success green
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
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
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

export default IncomeOverview;
