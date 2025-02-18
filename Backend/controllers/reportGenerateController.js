// const express = require("express");
// const { Parser } = require("json2csv");
// const Equipment = require("../models/equipment");
// const router = express.Router();

// // PDF generation
// const PDFDocument = require("pdfkit");

// // Full report route
// router.get("/reports/full/pdf", async (req, res) => {
//   try {
//     console.log("Full report endpoint hit");
//     const equipment = await Equipment.find()
//       .populate("Category", "name")
//       .sort({ createdAt: -1 });//Sorts the equipment by their creation date in descending order (newest first).

//     const doc = new PDFDocument();
//     res.header("Content-Type", "application/pdf");
//     res.attachment("full_report.pdf");

//     doc.pipe(res);

//     // Title
//     doc.fontSize(16).text("Full Equipment Report", { align: "center" });
//     doc.moveDown();

//     // Table Headers
//     doc
//       .fontSize(12)
//       .text("Name | Category | Brand | Quantity | Created Date | Updated Date");
//     doc.moveDown();

//     // Table Content
//     equipment.forEach((item) => {
//       doc
//         .fontSize(10)
//         .text(
//           `${item.Name} | ${item.Category.name} | ${item.Brand} | ${
//             item.Quantity
//           } | ${new Date(item.createdAt).toLocaleString()} | ${new Date(
//             item.updatedAt
//           ).toLocaleString()}`
//         );
//       doc.moveDown();
//     });

//     doc.end();
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

// // Categorical report route
// router.get("/reports/category/pdf", async (req, res) => {
//   try {
//     const { categoryId } = req.query;

//     if (!categoryId) {
//       return res.status(400).send({ message: "Category ID is required" });
//     }

//     const equipment = await Equipment.find({ Category: categoryId })
//       .populate("Category", "name")
//       .sort({ createdAt: -1 });

//     const doc = new PDFDocument();
//     res.header("Content-Type", "application/pdf");
//     res.attachment("category_report.pdf");

//     doc.pipe(res);

//     // Title
//     doc
//       .fontSize(16)
//       .text(`Equipment Report for Category: ${equipment[0]?.Category.name}`, {
//         align: "center",
//       });
//     doc.moveDown();

//     // Table Headers
//     doc
//       .fontSize(12)
//       .text("Name | Brand | Quantity | Created Date | Updated Date");
//     doc.moveDown();

//     // Table Content
//     equipment.forEach((item) => {
//       doc
//         .fontSize(10)
//         .text(
//           `${item.Name} | ${item.Brand} | ${item.Quantity} | ${new Date(
//             item.createdAt
//           ).toLocaleString()} | ${new Date(item.updatedAt).toLocaleString()}`
//         );
//       doc.moveDown();
//     });

//     doc.end();
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const PDFDocument = require("pdfkit");
const Equipment = require("../models/equipment");
const router = express.Router();

// Get unique categories and names
router.get("/report-options", async (req, res) => {
  try {
    const equipment = await Equipment.find();
    
    // Extract unique categories and names
    const categories = [...new Set(equipment.map(item => item.Category))];
    const names = [...new Set(equipment.map(item => item.Name))];
    
    res.status(200).json({ categories, names });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Full report route
router.get("/reports/full/pdf", async (req, res) => {
  try {
    const equipment = await Equipment.find().sort({ createdAt: -1 });
    
    const doc = new PDFDocument();
    
    // Set response headers for both preview and download
    res.header("Content-Type", "application/pdf");
    // Check if it's a preview request
    if (req.query.preview === "true") {
      res.header("Content-Disposition", "inline");
    } else {
      res.header("Content-Disposition", 'attachment; filename="full_report.pdf"');
    }
    
    doc.pipe(res);

    // Title and metadata
    doc.fontSize(20).text("Equipment Inventory Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" });
    doc.moveDown(2);

    // Table Headers
    const headers = ["Name", "Category", "Brand", "Lab", "Serial", "Unique ID", "Availability", "Created Date"];
    let yPosition = doc.y;
    let xPosition = 50;
    
    headers.forEach((header, i) => {
      doc.fontSize(10).text(header, xPosition + (i * 60), yPosition, { width: 55 });
    });
    
    doc.moveDown();
    yPosition = doc.y;

    // Table Content
    equipment.forEach((item) => {
      xPosition = 50;
      
      const rowData = [
        item.Name,
        item.Category,
        item.Brand,
        item.Lab,
        item.Serial,
        item.uniqueId,
        item.Availability ? "Available" : "Unavailable",
        new Date(item.createdAt).toLocaleDateString()
      ];

      rowData.forEach((text, i) => {
        doc.fontSize(8).text(String(text), xPosition + (i * 60), yPosition, { width: 55 });
      });

      yPosition += 20;
      
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }
    });

    doc.end();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Filtered report route
router.get("/reports/filtered/pdf", async (req, res) => {
  try {
    const { name, category } = req.query;
    
    const filter = {};
    if (name) filter.Name = name;
    if (category) filter.Category = category;

    const equipment = await Equipment.find(filter).sort({ createdAt: -1 });

    const doc = new PDFDocument();
    
    // Set response headers for both preview and download
    res.header("Content-Type", "application/pdf");
    if (req.query.preview === "true") {
      res.header("Content-Disposition", "inline");
    } else {
      res.header("Content-Disposition", 'attachment; filename="filtered_report.pdf"');
    }
    
    doc.pipe(res);

    // Title and metadata
    doc.fontSize(20).text("Filtered Equipment Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" });
    if (name) doc.fontSize(10).text(`Name Filter: ${name}`, { align: "left" });
    if (category) doc.fontSize(10).text(`Category Filter: ${category}`, { align: "left" });
    doc.moveDown(2);

    // Table Headers
    const headers = ["Name", "Category", "Brand", "Lab", "Serial", "Unique ID", "Availability", "Created Date"];
    let yPosition = doc.y;
    let xPosition = 50;
    
    headers.forEach((header, i) => {
      doc.fontSize(10).text(header, xPosition + (i * 60), yPosition, { width: 55 });
    });
    
    doc.moveDown();
    yPosition = doc.y;

    equipment.forEach((item) => {
      xPosition = 50;
      
      const rowData = [
        item.Name,
        item.Category,
        item.Brand,
        item.Lab,
        item.Serial,
        item.uniqueId,
        item.Availability ? "Available" : "Unavailable",
        new Date(item.createdAt).toLocaleDateString()
      ];

      rowData.forEach((text, i) => {
        doc.fontSize(8).text(String(text), xPosition + (i * 60), yPosition, { width: 55 });
      });

      yPosition += 20;
      
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }
    });

    doc.end();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;