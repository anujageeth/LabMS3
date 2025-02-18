const express = require("express");
const multer = require("multer");
const { bucket } = require("../middleware/firebase");
const Equipment = require("../models/equipment");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// **Add Equipment**
const addEquipment = async (req, res) => {
  try {
    const { Name, Lab, Category, Brand, Serial, Availability } = req.body;

    if (!Serial) {
      return res.status(400).send({ message: "Serial number is required." });
    }

    // Default image URL
    const defaultImageUrl = "default";

    let imageUrl;

    // Check if an image file was uploaded
    if (req.file) {
      const file = req.file;
      const blob = bucket.file(Date.now() + "_" + file.originalname);
      const blobStream = blob.createWriteStream({ metadata: { contentType: file.mimetype } });

      await new Promise((resolve, reject) => {
        blobStream.on("error", (err) => reject(res.status(500).send({ message: err.message })));

        blobStream.on("finish", async () => {
          await blob.makePublic();
          imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve();
        });

        blobStream.end(file.buffer);
      });
    } else {
      imageUrl = defaultImageUrl;
    }

    // Generate uniqueId
    const uniqueId = `${Category}/${Name}/${Brand}/${Serial}`;

    const newEquipment = new Equipment({
      Name,
      Lab,
      Category,
      Brand,
      Serial,
      uniqueId,
      Availability,
      imageUrl,
    });

    await newEquipment.save();
    res.status(201).send({ message: "Equipment added successfully!", newEquipment });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// **Get Equipment**
const getEquipment = async (req, res) => {
  try {
    const { Lab, Category } = req.query;

    let filter = {};
    if (Lab) filter.Lab = Lab;
    if (Category) filter.Category = Category;

    const equipment = await Equipment.find(filter);
    res.status(200).send(equipment);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// **Get Equipment By ID**
const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).send({ message: "Equipment not found" });
    }

    res.status(200).send(equipment);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// **Delete Equipment**
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).send({ message: "Equipment not found" });
    }

    const imageUrl = equipment.imageUrl;

    if (imageUrl.includes("storage.googleapis.com")) {
      const imageName = imageUrl.split("/").pop();
      const file = bucket.file(imageName);
      await file.delete();
    }

    await Equipment.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Equipment and image deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// **Update Equipment**
const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.status(404).send({ message: "Equipment not found" });
    }

    const updatedData = {
      Name: req.body.Name || equipment.Name,
      Lab: req.body.Lab || equipment.Lab,
      Category: req.body.Category || equipment.Category,
      Brand: req.body.Brand || equipment.Brand,
      Serial: req.body.Serial || equipment.Serial,
      Availability: req.body.Availability !== undefined ? req.body.Availability : equipment.Availability,
    };

    // Regenerate uniqueId if Serial, Category, Name, or Brand changes
    updatedData.uniqueId = `${updatedData.Category}/${updatedData.Name}/${updatedData.Brand}/${updatedData.Serial}`;

    const updatedEquipment = await Equipment.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).send({ message: "Equipment updated successfully", equipment: updatedEquipment });
  } catch (error) {
    res.status(500).send({ message: "Error updating equipment", error: error.message });
  }
};

module.exports = {
  addEquipment,
  getEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  upload,
};
