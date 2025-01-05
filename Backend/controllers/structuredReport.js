const express = require("express");
const { jsPDF } = require("jspdf");
require("jspdf-autotable");
const Equipment = require("../models/equipment");
const router = express.Router();

// Full report route
router.get("/reports/full/pdf", async (req, res) => {
  try {
    console.log("Full report endpoint hit");
    const equipment = await Equipment.find()
      .populate("Category", "name")
      .sort({ createdAt: -1 });

    // Create a new PDF document
    const doc = new jsPDF();
    res.header("Content-Type", "application/pdf");
    res.attachment("full_report.pdf");

    // Add the report creation date at the top
    doc.setFontSize(14);
    doc.text(`Full Equipment Report`, 14, 10);
    doc.setFontSize(10);
    doc.text(`Report created on: ${new Date().toLocaleString()}`, 14, 20);

    // Define table columns and data
    const columns = [
      { header: "Name", dataKey: "Name" },
      { header: "Category", dataKey: "Category" },
      { header: "Brand", dataKey: "Brand" },
      { header: "Quantity", dataKey: "Quantity" },
      { header: "Created Date", dataKey: "createdAt" },
      { header: "Updated Date", dataKey: "updatedAt" },
    ];

    const data = equipment.map((item) => ({
      Name: item.Name,
      Category: item.Category.name,
      Brand: item.Brand,
      Quantity: item.Quantity,
      createdAt: new Date(item.createdAt).toLocaleString(),
      updatedAt: new Date(item.updatedAt).toLocaleString(),
    }));

    // Add the table to the PDF
    doc.autoTable({
      startY: 30,
      head: [columns.map((col) => col.header)],
      body: data.map((row) => columns.map((col) => row[col.dataKey])),
    });

    // Save or stream the PDF
    //console.log("Columns:", columns);
    //console.log("Table data:", data);
    // doc.save("full_report.pdf");
    // res.end();
    // Stream PDF directly to the client
    const pdfOutput = doc.output("arraybuffer");
    res.send(Buffer.from(pdfOutput));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Categorical report route
router.get("/reports/category/pdf", async (req, res) => {
  try {
    const { categoryId } = req.query;

    if (!categoryId) {
      return res.status(400).send({ message: "Category ID is required" });
    }

    const equipment = await Equipment.find({ Category: categoryId })
      .populate("Category", "name")
      .sort({ createdAt: -1 });

    const doc = new jsPDF();
    res.header("Content-Type", "application/pdf");
    res.attachment("category_report.pdf");

    // Add the report creation date and title
    doc.setFontSize(14);
    doc.text(
      `Equipment Report for Category: ${equipment[0]?.Category.name}`,
      14,
      10
    );
    doc.setFontSize(10);
    doc.text(`Report created on: ${new Date().toLocaleString()}`, 14, 20);

    // Define table columns and data
    const columns = [
      { header: "Name", dataKey: "Name" },
      { header: "Brand", dataKey: "Brand" },
      { header: "Quantity", dataKey: "Quantity" },
      { header: "Created Date", dataKey: "createdAt" },
      { header: "Updated Date", dataKey: "updatedAt" },
    ];

    const data = equipment.map((item) => ({
      Name: item.Name,
      Brand: item.Brand,
      Quantity: item.Quantity,
      createdAt: new Date(item.createdAt).toLocaleString(),
      updatedAt: new Date(item.updatedAt).toLocaleString(),
    }));

    // Add the table to the PDF
    doc.autoTable({
      startY: 30,
      head: [columns.map((col) => col.header)],
      body: data.map((row) => columns.map((col) => row[col.dataKey])),
    });

    // Save or stream the PDF
    // doc.save("category_report.pdf");
    // res.end();
    // Stream PDF directly to the client
    const pdfOutput = doc.output("arraybuffer");
    res.send(Buffer.from(pdfOutput));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
