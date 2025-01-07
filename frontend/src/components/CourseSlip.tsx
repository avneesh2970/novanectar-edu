/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CourseSlipProps } from '../types';

const CourseSlip: React.FC<CourseSlipProps> = ({ courseData }) => {
  const generatePDF = () => {
    // Initialize PDF document
    const doc = new jsPDF();
    
    // Set initial y position
    let yPos = 20;
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(0, 87, 183); // Blue color
    doc.text(courseData.title_, 20, yPos);
    
    // Add description
    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    const splitDescription = doc.splitTextToSize(courseData.description_, 170);
    doc.text(splitDescription, 20, yPos);
    
    // Course Overview
    yPos += splitDescription.length * 7 + 10;
    doc.setFontSize(16);
    doc.setTextColor(0, 87, 183);
    doc.text("Course Overview", 20, yPos);
    
    // Overview details
    yPos += 10;
    const overviewData = [
      ["Duration", "Category", "Rating"],
      [courseData.duration, courseData.category, `${courseData.stats.rating}/5`]
    ];
    autoTable(doc, {
      startY: yPos,
      head: [overviewData[0]],
      body: [overviewData[1]],
      theme: 'grid'
    });
    
    // Features
    yPos = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.text("Course Features", 20, yPos);
    
    // Features table
    yPos += 5;
    const featuresRows = courseData.features.map(feature => [feature]);
    autoTable(doc, {
      startY: yPos,
      body: featuresRows,
      theme: 'plain',
      styles: { cellPadding: 2 }
    });
    
    // Course Includes
    yPos = (doc as any).lastAutoTable.finalY + 15;
    doc.text("Course Includes", 20, yPos);
    
    // Course includes table
    yPos += 5;
    const includesRows = Object.values(courseData.courseIncludes).map(value => [value]);
    autoTable(doc, {
      startY: yPos,
      body: includesRows,
      theme: 'plain',
      styles: { cellPadding: 2 }
    });
    
    // Course Content
    yPos = (doc as any).lastAutoTable.finalY + 15;
    doc.text("Course Content", 20, yPos);
    
    // Content sections
    yPos += 5;
    courseData.content.forEach((section) => {
      const contentData = [
        [`${section.title} (${section.lectures} lectures • ${section.duration})`],
        ...section.content.slice(0, 2).map(lecture => [`• ${lecture}`])
      ];
      
      autoTable(doc, {
        startY: yPos,
        body: contentData,
        theme: 'plain',
        styles: { cellPadding: 2 }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 5;
    });
    
    // Footer
    yPos = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Total Enrolled Students: ${courseData.stats.learners}`, 20, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.text("This certificate is awarded by Novanectar", 20, yPos);
    
    // Save the PDF
    doc.save(`${courseData.title}-details.pdf`);
  };

  return (
    <button 
      onClick={generatePDF}
      className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
    >
      Download PDF
    </button>
  );
};

export default CourseSlip;