/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Text handling utility function
const safeText = (text: any): string => {
  if (text === null || text === undefined) return "";
  return String(text);
};

// Utility function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const CourseInvoice: React.FC<any> = ({
  courseData,
  billingDetails,
  invoiceNumber,
  purchaseDate,
}) => {
  const generateInvoice = () => {
    const doc = new jsPDF();

    // Company Logo/Header
    doc.setFontSize(24);
    doc.setTextColor(0, 87, 183);
    doc.text("Novanectar", 20, 20);

    // Invoice Title
    doc.setFontSize(16);
    doc.setTextColor(80, 80, 80);
    doc.text("INVOICE", 150, 20);

    // Invoice Details
    doc.setFontSize(10);
    doc.text(`Invoice Number: ${safeText(invoiceNumber)}`, 150, 30);
    doc.text(`Date: ${safeText(purchaseDate)}`, 150, 35);

    // Billing Details
    doc.setFontSize(12);
    doc.setTextColor(0, 87, 183);
    doc.text("Billed To:", 20, 45);

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);

    // Safely handle billing details with null checks
    if (billingDetails) {
      const name = safeText(billingDetails.name);
      const email = safeText(billingDetails.email);
      const phone = safeText(billingDetails.phone);
      const address = safeText(billingDetails.address);

      doc.text(name, 20, 52);
      doc.text(email, 20, 57);
      doc.text(phone, 20, 62);

      if (address) {
        const addressLines = doc.splitTextToSize(address, 80);
        addressLines.forEach((line: string, index: number) => {
          doc.text(safeText(line), 20, 67 + index * 5);
        });
      }
    }

    // Course Details Table
    const amount = courseData?.price || 0;
    const formattedAmount = formatCurrency(amount);

    const courseDetails = [
      ['Description', 'Duration', 'Amount'],
      [
        courseData?.title_ || courseData?.title || 'Course',
        courseData?.duration || '',
        `₹${formattedAmount}`
      ]
    ];

    autoTable(doc, {
      startY: 90,
      head: [courseDetails[0]],
      body: [courseDetails[1]],
      theme: "grid",
      headStyles: { fillColor: [0, 87, 183] },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
      },
    });

  // Calculate Totals
  const subtotal = amount;
  const gst = subtotal * 0.18; // 18% GST
  const total = subtotal + gst;
  
  // Add Totals
  const startY = (doc as any).lastAutoTable.finalY + 10;

  autoTable(doc, {
    startY: startY,
    body: [
      ['Subtotal', `₹${formatCurrency(subtotal)}`],
      ['GST (18%)', `₹${formatCurrency(gst)}`],
      ['Total', `₹${formatCurrency(total)}`]
    ],
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 140 },
      1: { cellWidth: 50, halign: 'right' }
    }
  });

    // Terms and Conditions
    const termsY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text("Terms and Conditions:", 20, termsY);

    const terms = [
      "1. Course access will be provided within 24 hours of purchase",
      "2. This invoice is valid for one-time course access",
      "3. GST charged as per applicable rates",
      "4. For support, contact: support@novanectar.com",
    ];

    terms.forEach((term, index) => {
      doc.text(safeText(term), 20, termsY + 7 + index * 5);
    });

    // Footer
    doc.setFontSize(8);
    doc.text(
      "Thank you for choosing Novanectar for your learning journey!",
      20,
      280
    );

    // Save the invoice
    const invoiceFileName = `invoice-${safeText(
      invoiceNumber || Date.now()
    )}.pdf`;
    doc.save(invoiceFileName);
  };

  return (
    <button
      onClick={generateInvoice}
      className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Download Invoice
    </button>
  );
};

export default CourseInvoice;
