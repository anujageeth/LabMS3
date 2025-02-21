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

const columns = [
  { header: "Serial", width: 32 },
  { header: "Name", width: 100 },
  { header: "Category", width: 90 },
  { header: "Brand", width: 75 },
  { header: "Lab", width: 95 },
  { header: "Created on", width: 50 },
  { header: "Availability", width: 55 },
  { header: "Condition", width: 50 }
];

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
    doc.font("Times-Roman");

    // Title and metadata
    doc.fontSize(16).text("Department of Electrical and Information Engineering", { align: "center" });
    doc.fontSize(14).text("Faculty of Engineering", { align: "center" });
    doc.fontSize(13).text("University of Ruhuna", { align: "center" });
    doc.fontSize(20).text("Equipment Inventory Report", { align: "center" });
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" });
    doc.fontSize(10).text("-------------------------------------------------------------------------------------------------------------------------------------------", { align: "center" });
    doc.moveDown(2);

    // Table Headers
    const headers = ["Serial", "Name", "Category", "Brand", "Lab", "Created on", "Availability", "Condition"];
    let yPosition = doc.y;
    let xPosition = 50;
    let rowHeight = 20;

    // **Draw Header Row with Borders**
    doc.lineWidth(1);
    columns.forEach((col) => {
      doc.fontSize(9).text(col.header, xPosition + 5, yPosition + 5, { width: col.width - 10, align: "left" });

      // **Draw header cell borders**
      doc.rect(xPosition, yPosition, col.width, rowHeight).stroke();
      xPosition += col.width;
    });

    columns.forEach((col) => {
      doc.fontSize(8).text(col.header, xPosition, yPosition, { width: col.width, align: "left" });
      xPosition += col.width; // Move X position for next column
    });
    
    headers.forEach((header, i) => {
      doc.fontSize(8).text(header, xPosition + (i * 60), yPosition, { width: 55 });
    });
    
    doc.moveDown();
    yPosition += rowHeight;

    // Table Content
    equipment.forEach((item) => {
      xPosition = 50;
      
      const rowData = [
        item.Serial,
        item.Name,
        item.Category,
        item.Brand,
        item.Lab,
        new Date(item.createdAt).toLocaleDateString(),
        item.Availability ? "Available" : "Unavailable",
        item.condition ? "good" : "damaged"
        
      ];

      rowData.forEach((text, i) => {
        doc.fontSize(8).text(String(text), xPosition+5, yPosition+5, { width: columns[i].width, align: "left" });
        
        // **Draw cell borders**
        doc.rect(xPosition, yPosition, columns[i].width, rowHeight).stroke()
        xPosition += columns[i].width; // Move X position for next column
      });

      yPosition += rowHeight;
      
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
    doc.font("Times-Roman");

    // Title and metadata
    doc.fontSize(16).text("Department of Electrical and Information Engineering", { align: "center" });
    doc.fontSize(14).text("Faculty of Engineering", { align: "center" });
    doc.fontSize(13).text("University of Ruhuna", { align: "center" });
    doc.fontSize(20).text("Filtered Equipment Report", { align: "center" });
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" });
    if (name) doc.fontSize(10).text(`Name Filter: ${name}`, { align: "left" });
    if (category) doc.fontSize(10).text(`Category Filter: ${category}`, { align: "left" });
    doc.fontSize(10).text("-------------------------------------------------------------------------------------------------------------------------------------------", { align: "center" });
    doc.moveDown(2);

    // Table Headers
    const headers = ["Serial", "Name", "Category", "Brand", "Lab", "Created on", "Availability", "Condition"];
    let yPosition = doc.y;
    let xPosition = 50;
    let rowHeight = 20;

    // **Draw Header Row with Borders**
    doc.lineWidth(1);
    columns.forEach((col) => {
      doc.fontSize(9).text(col.header, xPosition + 5, yPosition + 5, { width: col.width - 10, align: "left" });

      // **Draw header cell borders**
      doc.rect(xPosition, yPosition, col.width, rowHeight).stroke();
      xPosition += col.width;
    });

    columns.forEach((col) => {
      doc.fontSize(10).text(col.header, xPosition, yPosition, { width: col.width, align: "left" });
      xPosition += col.width; // Move X position for next column
    });
    
    headers.forEach((header, i) => {
      doc.fontSize(10).text(header, xPosition + (i * 60), yPosition, { width: 55 });
    });
    
    doc.moveDown();
    yPosition += rowHeight;

    equipment.forEach((item) => {
      xPosition = 50;
      
      const rowData = [
        item.Serial,
        item.Name,
        item.Category,
        item.Brand,
        item.Lab,
        new Date(item.createdAt).toLocaleDateString(),
        item.Availability ? "Available" : "Unavailable",
        item.condition ? "good" : "damaged"
      ];

      rowData.forEach((text, i) => {
        doc.fontSize(8).text(String(text), xPosition+5, yPosition+5, { width: columns[i].width, align: "left" });
        doc.rect(xPosition, yPosition, columns[i].width, rowHeight).stroke()
        xPosition += columns[i].width; // Move X position for next column
      });

      yPosition += rowHeight;
      
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