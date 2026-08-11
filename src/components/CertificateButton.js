'use client';
import { useState } from 'react';
import jsPDF from 'jspdf';

export default function CertificateButton({ studentName, courseName, completionDate }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCertificate = () => {
    setIsGenerating(true);
    
    try {
      // Create landscape A4 document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4'
      });

      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // Background color
      doc.setFillColor(248, 246, 242); // --bg-main
      doc.rect(0, 0, width, height, 'F');

      // Outer gold border
      doc.setDrawColor(200, 168, 107); // --accent-gold
      doc.setLineWidth(4);
      doc.rect(20, 20, width - 40, height - 40);

      // Inner thin gold border
      doc.setLineWidth(1);
      doc.rect(25, 25, width - 50, height - 50);

      // Logo/Title Header
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(17, 17, 17); // --text-primary
      doc.setFontSize(24);
      doc.text("PARASTRUCTURE", width / 2, 80, { align: 'center' });
      
      // Accent line under logo
      doc.setDrawColor(200, 168, 107);
      doc.setLineWidth(2);
      doc.line(width / 2 - 40, 95, width / 2 + 40, 95);

      // Main Certificate Title
      doc.setFontSize(42);
      doc.text("CERTIFICATE OF COMPLETION", width / 2, 160, { align: 'center' });

      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      doc.setTextColor(85, 85, 85); // --text-secondary
      doc.text("THIS IS PROUDLY PRESENTED TO", width / 2, 210, { align: 'center' });

      // Student Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(36);
      doc.setTextColor(200, 168, 107); // Gold name
      doc.text(studentName.toUpperCase(), width / 2, 260, { align: 'center' });

      // Course description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      doc.setTextColor(85, 85, 85);
      doc.text("For successfully completing the elite bridge engineering program:", width / 2, 310, { align: 'center' });

      // Course Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(17, 17, 17);
      doc.text(courseName, width / 2, 340, { align: 'center' });

      // Footer - Date & Signature Line
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      
      // Date
      doc.text(`Date of Issue: ${completionDate}`, 80, 420);
      doc.setDrawColor(17, 17, 17);
      doc.setLineWidth(0.5);
      doc.line(80, 425, 200, 425);
      
      // Signature
      doc.text("Aditya (Director)", width - 200, 420);
      doc.line(width - 200, 425, width - 80, 425);

      // Download
      const safeCourseName = courseName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      doc.save(`ParaStructure_Certificate_${safeCourseName}.pdf`);
      
    } catch (error) {
      console.error("Failed to generate certificate:", error);
      alert("There was an error generating your certificate. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={generateCertificate} 
      disabled={isGenerating}
      style={{ 
        textAlign: 'center', 
        display: 'block', 
        background: 'rgba(200, 168, 107, 0.15)', 
        border: '1px solid var(--accent-gold)', 
        color: 'var(--accent-gold)', 
        padding: '12px', 
        borderRadius: '8px', 
        fontWeight: 600, 
        fontSize: '0.9rem',
        cursor: isGenerating ? 'wait' : 'pointer',
        width: '100%'
      }}
    >
      {isGenerating ? '⏳ Generating...' : '🏆 Download Certificate'}
    </button>
  );
}
