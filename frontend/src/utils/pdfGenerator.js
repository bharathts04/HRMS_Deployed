import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePayslipPdf = (payrollRecord, companyName = "HRMS Corporation") => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont("helvetica");

  // Company Header
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Primary color
  doc.text(companyName, 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Salary Slip', 105, 28, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 35, 196, 35); // Horizontal line

  // Employee Details
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  
  // Left Column
  doc.text(`Employee Name: ${payrollRecord.employeeName || 'N/A'}`, 14, 45);
  doc.text(`Employee ID: EMP-${payrollRecord.employeeId || 'N/A'}`, 14, 52);
  
  // Right Column
  doc.text(`Salary Month: ${payrollRecord.month} ${payrollRecord.year}`, 120, 45);
  doc.text(`Payment Date: ${payrollRecord.paymentDate || 'N/A'}`, 120, 52);

  // Earnings and Deductions Table
  const basic = payrollRecord.basic || 0;
  const hra = payrollRecord.hra || 0;
  const bonus = payrollRecord.bonus || 0;
  const allowance = payrollRecord.allowance || 0;
  
  const tax = payrollRecord.tax || 0;
  const pf = payrollRecord.pf || 0;
  
  const totalEarnings = basic + hra + bonus + allowance;
  const totalDeductions = tax + pf;
  
  autoTable(doc, {
    startY: 65,
    head: [['Earnings', 'Amount ($)', 'Deductions', 'Amount ($)']],
    body: [
      ['Basic Salary', basic.toFixed(2), 'Tax Deducted', tax.toFixed(2)],
      ['House Rent Allowance', hra.toFixed(2), 'Provident Fund (PF)', pf.toFixed(2)],
      ['Bonus', bonus.toFixed(2), '', ''],
      ['Other Allowances', allowance.toFixed(2), '', ''],
    ],
    foot: [
      ['Total Earnings', totalEarnings.toFixed(2), 'Total Deductions', totalDeductions.toFixed(2)]
    ],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5 }
  });

  // Net Salary
  const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : (doc.previousAutoTable ? doc.previousAutoTable.finalY : 120)) + 15;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(`Net Salary Payable: $${payrollRecord.netSalary.toFixed(2)}`, 14, finalY);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`(Amount in words: Note - programmatic translation omitted)`, 14, finalY + 6);

  // Footer / Signatures
  doc.setLineWidth(0.5);
  doc.line(14, finalY + 30, 60, finalY + 30);
  doc.text("Employer Signature", 14, finalY + 35);

  doc.line(150, finalY + 30, 196, finalY + 30);
  doc.text("Employee Signature", 150, finalY + 35);
  
  // Save PDF
  const filename = `Payslip_${payrollRecord.employeeName.replace(/\s+/g, '_')}_${payrollRecord.month}_${payrollRecord.year}.pdf`;
  doc.save(filename);
};
