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
// Add Equipment - Fixed to prevent multiple responses
const addEquipment = async (req, res) => {
  try {
    const { Name, Lab, Category, Brand, Serial, Availability } = req.body;

    // Validate required fields
    if (!Serial) {
      return res.status(400).json({ message: "Serial number is required." });
    }

    // Default image URL
    const defaultImageUrl = "default";
    let imageUrl = defaultImageUrl;

    // Check if an image file was uploaded
    if (req.file) {
      try {
        const file = req.file;
        const fileName = `${Date.now()}_${file.originalname}`;
        const blob = bucket.file(fileName);
        
        // Create a write stream to upload the file
        const blobStream = blob.createWriteStream({
          metadata: { contentType: file.mimetype }
        });

        // Handle upload as a Promise to avoid multiple responses
        await new Promise((resolve, reject) => {
          blobStream.on("error", (err) => {
            console.error("Firebase storage error:", err);
            reject(err);
          });

          blobStream.on("finish", async () => {
            // Make the file public
            try {
              await blob.makePublic();
              imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
              resolve();
            } catch (err) {
              console.error("Error making blob public:", err);
              reject(err);
            }
          });

          // End the stream with the file buffer
          blobStream.end(req.file.buffer);
        });
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        // Continue with default image instead of sending response here
        imageUrl = defaultImageUrl;
      }
    }

    // Generate uniqueId
    const uniqueId = `${Category}/${Name}/${Brand}/${Serial}`;

    // Create the equipment record
    const newEquipment = new Equipment({
      Name,
      Lab,
      Category,
      Brand,
      Serial,
      uniqueId,
      Availability: Availability === "true" || Availability === true,
      imageUrl,
    });

    // Save to database
    await newEquipment.save();
    
    // Send successful response
    return res.status(201).json({ 
      message: "Equipment added successfully!", 
      data: newEquipment 
    });

  } catch (error) {
    console.error("Add equipment error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// **Get Equipment with Pagination and Filtering**
const getEquipment = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      Lab,
      Category,
      search,
      sortBy = 'Name',
      sortOrder = 'asc',
      condition
    } = req.query;

    // Build filter object
    let filter = {};
    if (Lab) filter.Lab = Lab;
    if (Category) filter.Category = Category;
    if (condition) filter.condition = condition;
    if (search) {
      filter.$or = [
        { Name: { $regex: search, $options: 'i' } },
        { Serial: { $regex: search, $options: 'i' } },
        { Brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute queries in parallel
    const [equipment, total] = await Promise.all([
      Equipment.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Equipment.countDocuments(filter)
    ]);

    // Add metadata about damaged equipment
    const damagedCount = await Equipment.countDocuments({ condition: 'damaged' });

    res.status(200).json({
      equipment,
      pagination: {
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      },
      metadata: {
        damagedCount,
        availableCount: total - damagedCount
      }
    });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ 
      message: "Error fetching equipment", 
      error: error.message 
    });
  }
};

// **Get Equipment By ID with Optimizations**
const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .select('-__v') // Exclude version key
      .lean(); // Convert to plain JS object for better performance

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Add related equipment suggestions (same category)
    const relatedEquipment = await Equipment.find({
      Category: equipment.Category,
      _id: { $ne: equipment._id }
    })
      .select('Name Brand Serial condition')
      .limit(5)
      .lean();

    res.status(200).json({
      equipment,
      relatedEquipment
    });
  } catch (error) {
    console.error('Error fetching equipment by ID:', error);
    res.status(500).json({ 
      message: "Error fetching equipment", 
      error: error.message 
    });
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

// **Update Equipment with Condition Handling**
const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    const updatedData = {
      Name: req.body.Name || equipment.Name,
      Lab: req.body.Lab || equipment.Lab,
      Category: req.body.Category || equipment.Category,
      Brand: req.body.Brand || equipment.Brand,
      Serial: req.body.Serial || equipment.Serial,
      condition: req.body.condition || equipment.condition,
      // Set Availability based on condition
      Availability: req.body.condition === 'damaged' ? false : 
        (req.body.Availability !== undefined ? req.body.Availability : equipment.Availability)
    };

    // Regenerate uniqueId
    updatedData.uniqueId = `${updatedData.Category}/${updatedData.Name}/${updatedData.Brand}/${updatedData.Serial}`;

    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id, 
      updatedData, 
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      message: "Equipment updated successfully", 
      equipment: updatedEquipment 
    });
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(500).json({ 
      message: "Error updating equipment", 
      error: error.message 
    });
  }
};

// **Get Equipment Statistics**
const getEquipmentStats = async (req, res) => {
  try {
    // Category-wise stats (existing code)
    const categoryStats = await Equipment.aggregate([
      {
        $group: {
          _id: '$Category',
          total: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ['$condition', 'good'] }, 1, 0] }
          },
          damaged: {
            $sum: { $cond: [{ $eq: ['$condition', 'damaged'] }, 1, 0] }
          },
          inUse: {
            $sum: { $cond: [{ $eq: ['$Availability', false] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 1,
          category: '$_id',
          total: 1,
          available: 1,
          damaged: 1,
          inUse: 1,
          availabilityRate: {
            $multiply: [
              { $divide: ['$available', { $max: ['$total', 1] }] },
              100
            ]
          }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Name-wise stats (new addition)
    const nameStats = await Equipment.aggregate([
      {
        $group: {
          _id: '$Name',
          total: { $sum: 1 },
          categories: { $addToSet: '$Category' },
          available: {
            $sum: { $cond: [{ $eq: ['$condition', 'good'] }, 1, 0] }
          },
          damaged: {
            $sum: { $cond: [{ $eq: ['$condition', 'damaged'] }, 1, 0] }
          },
          inUse: {
            $sum: { $cond: [{ $eq: ['$Availability', false] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: '$_id',
          total: 1,
          categories: 1,
          available: 1,
          damaged: 1,
          inUse: 1,
          availabilityRate: {
            $multiply: [
              { $divide: ['$available', { $max: ['$total', 1] }] },
              100
            ]
          }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Overall stats (existing code)
    const overall = await Equipment.aggregate([
      {
        $group: {
          _id: null,
          totalEquipment: { $sum: 1 },
          totalAvailable: {
            $sum: { $cond: [{ $eq: ['$condition', 'good'] }, 1, 0] }
          },
          totalDamaged: {
            $sum: { $cond: [{ $eq: ['$condition', 'damaged'] }, 1, 0] }
          },
          totalInUse: {
            $sum: { $cond: [{ $eq: ['$Availability', false] }, 1, 0] }
          },
          uniqueNames: { $addToSet: '$Name' },
          uniqueCategories: { $addToSet: '$Category' }
        }
      },
      {
        $project: {
          _id: 0,
          totalEquipment: 1,
          totalAvailable: 1,
          totalDamaged: 1,
          totalInUse: 1,
          uniqueNameCount: { $size: '$uniqueNames' },
          uniqueCategoryCount: { $size: '$uniqueCategories' }
        }
      }
    ]);

    res.status(200).json({
      categoryStats,
      nameStats,
      overall: overall[0]
    });
  } catch (error) {
    console.error('Error fetching equipment statistics:', error);
    res.status(500).json({ 
      message: "Error fetching equipment statistics", 
      error: error.message 
    });
  }
};

// **Get Unique Values**
const getUniqueValues = async (req, res) => {
  try {
    const [names, categories, brands] = await Promise.all([
      Equipment.distinct('Name'),
      Equipment.distinct('Category'),
      Equipment.distinct('Brand')
    ]);

    // Sort arrays and remove empty/null values
    const cleanAndSort = (arr) => arr
      .filter(item => item && item.trim())
      .sort((a, b) => a.localeCompare(b));

    res.status(200).json({
      success: true,
      data: {
        names: cleanAndSort(names),
        categories: cleanAndSort(categories),
        brands: cleanAndSort(brands)
      }
    });
  } catch (error) {
    console.error('Error fetching unique values:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching unique values",
      error: error.message 
    });
  }
};

// Update the exports to include getEquipmentStats and getUniqueValues
module.exports = {
  addEquipment,
  getEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  getEquipmentStats,
  getUniqueValues,
  upload,
};
