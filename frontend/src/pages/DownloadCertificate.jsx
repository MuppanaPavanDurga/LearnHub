import React from "react";
import { Button, Container } from "react-bootstrap";
import jsPDF from "jspdf";

const DownloadCertificate = ({ user, course }) => {
  const generateCertificate = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 297, 210, 'F');

    doc.setDrawColor(44, 62, 80);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    doc.setFontSize(28);
    doc.setTextColor(44, 62, 80); 
    doc.setFont("times", "bold");
    doc.text("Certificate of Completion", 148, 45, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("This certifies that", 148, 65, { align: "center" });

    doc.setFontSize(24);
    doc.setFont("courier", "bold");
    doc.setTextColor(34, 153, 84);
    doc.text(user.name.toUpperCase(), 148, 80, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text("has successfully completed the course", 148, 95, { align: "center" });

    doc.setFontSize(20);
    doc.setFont("times", "bolditalic");
    doc.setTextColor(52, 73, 94);
    doc.text(`"${course.C_title}"`, 148, 110, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Instructor: ${course.C_educator}`, 148, 125, { align: "center" });

    const date = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 20, 190);

    doc.line(220, 180, 275, 180);
    doc.text("Signature", 248, 185, { align: "center" });

    doc.save(`${user.name}_certificate.pdf`);
  };

  return (
    <Container className="text-center my-4">
      <Button variant="dark" onClick={generateCertificate}>
        Download Certificate
      </Button>
    </Container>
  );
};

export default DownloadCertificate;
