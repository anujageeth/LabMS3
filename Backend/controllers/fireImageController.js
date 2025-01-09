const express = require("express");
const multer = require("multer"); // For handling file uploads
const { bucket } = require("../middleware/firebase"); // Firebase setup
const Equipment = require("../models/equipment");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files temporarily in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Route to add equipment with image upload
//router.post("/equipmentImage", upload.single("image"),
const addEquipment = async (req, res) => {
  try {
    const { Name, Lab, Category, Brand, Availability, Quantity } = req.body;

    // Default image URL from Google Drive
    const defaultImageUrl =
      "default";

    let imageUrl;

    // Check if an image file was uploaded
    if (req.file) {
      // Upload file to Firebase if provided
      const file = req.file;
      const blob = bucket.file(Date.now() + "_" + file.originalname);

      const blobStream = blob.createWriteStream({
        metadata: { contentType: file.mimetype },
      });

      // Handle the upload process
      await new Promise((resolve, reject) => {
        blobStream.on("error", (err) => {
          reject(res.status(500).send({ message: err.message }));
        });

        // blobStream.on("finish", () => {
        //   // Get the public URL of the uploaded image
        //   imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        //   resolve();
        // });

        blobStream.on("finish", async () => {
          // After the upload is finished, make the file publicly accessible
          await blob.makePublic(); // Make the file public

          // Get the public URL of the uploaded image
          imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve();
        });

        blobStream.end(file.buffer);
      });
    } else {
      // Use the default image URL if no image is uploaded
      imageUrl = defaultImageUrl;
    }

    // Create new equipment document
    const newEquipment = new Equipment({
      Name,
      Lab,
      Category,
      Brand,
      Availability,
      Quantity,
      imageUrl, // Store image URL in MongoDB
    });

    await newEquipment.save();
    console.log("newEquipment", newEquipment.Name);
    res.status(201).send({
      message: "Equipment added successfully!",
      newEquipment,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Route to get all equipment or filter by Lab and Category
//router.get("/equipmentImage",
const getEquipment = async (req, res) => {
  try {
    const { Lab, Category } = req.query; // Get Lab and Category from query parameters

    // Build the query filter based on provided parameters
    let filter = {};
    if (Lab) {
      filter.Lab = Lab; // Filter by Lab
    }
    if (Category) {
      filter.Category = Category; // Filter by Category
    }

    const equipment = await Equipment.find(filter)
      .populate("Lab")
      .populate("Category", "name"); // Populate Lab and Category name only details
    //   createdAt: equipment.createdAt, // Include createdAt
    //   updatedAt: equipment.updatedAt, // Include updatedAt
    const equipmentWithDetails = equipment.map((item) => ({
      ...item._doc,
      Category: item.Category.name,
      createdAt: item.createdAt, // Include createdAt
      updatedAt: item.updatedAt, // Include updatedAt
    }));

    res.status(200).send(equipmentWithDetails); // Send the equipment along with imageUrl and other details
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Route to get equipment by ID with Lab and Category populated
// router.get("/equipmentImage/:id",
const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate("Lab")
      .populate("Category", "name");

    if (!equipment) {
      return res.status(404).send({ message: "Equipment not found" });
    }

    // const equipmentWithName = {
    //   ...equipment._doc,
    //   Category: equipment.Category.name, // Replace the category ID with the name
    // };
    const equipmentDetails = {
      ...equipment._doc,
      Category: equipment.Category.name,
      createdAt: equipment.createdAt, // Include createdAt
      updatedAt: equipment.updatedAt, // Include updatedAt
    };

    res.status(200).send(equipmequipmentDetailsent); // Send the equipment along with the imageUrl and populated Lab, Category
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// router.delete("/equipmentImage/:id",
const deleteEquipment = async (req, res) => {
  try {
    console.log("Received ID for deletion:", req.params.id);
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).send({ message: "Equipment not found" });
    }

    // Extract the file name from the imageUrl
    const imageUrl = equipment.imageUrl;
    console.log("Image URL:", imageUrl);

    // Check if the image is stored in Firebase (not a Google Drive image)
    if (imageUrl.includes("storage.googleapis.com")) {
      const imageName = imageUrl.split("/").pop(); // Get the last part of the URL (the file name)
      console.log("Image name for deletion:", imageName);

      // Delete the image from Firebase
      const file = bucket.file(imageName);
      await file.delete();
      console.log("Image deleted from Firebase");
    } else {
      console.log("Skipping image deletion as it is not stored in Firebase.");
    }

    // Delete the equipment from MongoDB
    await Equipment.findByIdAndDelete(req.params.id);
    console.log("Equipment deleted from MongoDB");

    res
      .status(200)
      .send({ message: "Equipment and image deleted successfully" });
  } catch (error) {
    console.error("Error deleting equipment:", error); // Log the actual error
    res.status(500).send({ message: error.message });
  }
};

// router.put(
//   "/equipmentImage/:id",
//   authenticateToken,
//   authorizeRoles("hod", "technical officer"),
const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the equipment by ID
    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.status(404).send({ message: "Equipment not found" });
    }

    // Update the equipment with new data from the request body
    // const updatedData = {
    //   Name: req.body.Name,
    //   Lab: req.body.Lab,
    //   Category: req.body.Category,
    //   Brand: req.body.Brand,
    //   Quantity: req.body.Quantity,
    //   Availability: req.body.Availability || equipment.Availability, // Assuming Availability is a boolean
    // };
    const updatedData = {
      Name: req.body.Name || equipment.Name || req.body.editEquipment.Name,
      Lab: req.body.Lab || equipment.Lab || req.body.editEquipment.Lab,
      Category:
        req.body.Category ||
        equipment.Category ||
        req.body.editEquipment.Category,
      Brand: req.body.Brand || equipment.Brand || req.body.editEquipment.Brand,
      Quantity:
        req.body.Quantity ||
        equipment.Quantity ||
        req.body.editEquipment.Quantity,
      Availability:
        req.body.Availability !== undefined
          ? req.body.Availability
          : equipment.Availability || req.body.editEquipment.Availability,
    };

    // Update the equipment in the database
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true, // Return the updated document
      }
    );

    res.status(200).send({
      message: "Equipment updated successfully",
      equipment: updatedEquipment,
    });
  } catch (error) {
    console.error("Error updating equipment:", error);
    res
      .status(500)
      .send({ message: "Error updating equipment", error: error.message });
  }
};

//module.exports = router;

module.exports = {
  addEquipment,
  getEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentById,
  upload,
};
