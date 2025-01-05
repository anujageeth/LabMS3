const express = require("express");
const { Parser } = require("json2csv");
const Equipment = require("../models/equipment");
const router = express.Router();

// PDF generation
const PDFDocument = require("pdfkit");

// Full report route
router.get("/reports/full/pdf", async (req, res) => {
  try {
    console.log("Full report endpoint hit");
    const equipment = await Equipment.find()
      .populate("Category", "name")
      .sort({ createdAt: -1 });//Sorts the equipment by their creation date in descending order (newest first).

    const doc = new PDFDocument();
    res.header("Content-Type", "application/pdf");
    res.attachment("full_report.pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(16).text("Full Equipment Report", { align: "center" });
    doc.moveDown();

    // Table Headers
    doc
      .fontSize(12)
      .text("Name | Category | Brand | Quantity | Created Date | Updated Date");
    doc.moveDown();

    // Table Content
    equipment.forEach((item) => {
      doc
        .fontSize(10)
        .text(
          `${item.Name} | ${item.Category.name} | ${item.Brand} | ${
            item.Quantity
          } | ${new Date(item.createdAt).toLocaleString()} | ${new Date(
            item.updatedAt
          ).toLocaleString()}`
        );
      doc.moveDown();
    });

    doc.end();
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

    const doc = new PDFDocument();
    res.header("Content-Type", "application/pdf");
    res.attachment("category_report.pdf");

    doc.pipe(res);

    // Title
    doc
      .fontSize(16)
      .text(`Equipment Report for Category: ${equipment[0]?.Category.name}`, {
        align: "center",
      });
    doc.moveDown();

    // Table Headers
    doc
      .fontSize(12)
      .text("Name | Brand | Quantity | Created Date | Updated Date");
    doc.moveDown();

    // Table Content
    equipment.forEach((item) => {
      doc
        .fontSize(10)
        .text(
          `${item.Name} | ${item.Brand} | ${item.Quantity} | ${new Date(
            item.createdAt
          ).toLocaleString()} | ${new Date(item.updatedAt).toLocaleString()}`
        );
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
