const express = require("express");
const {
  addEquipment,
  getEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentById,
  getEquipmentStats,
  upload,
} = require("../controllers/newEquipmentController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Base equipment routes with pagination and filtering
router.get("/equipmentImage", authenticateToken, getEquipment);
router.get("/equipmentImage/:id", authenticateToken, getEquipmentById);

// Statistics route - accessible to admin roles
router.get(
  "/equipmentImage-stats", 
  authenticateToken, 
  
  getEquipmentStats
);

// Equipment management routes - restricted to admin roles
router.post(
  "/equipmentImage",
  authenticateToken,
  authorizeRoles("hod", "technical officer"),
  upload.single("image"),
  addEquipment
);

router.put(
  "/equipmentImage/:id",
  authenticateToken,
  authorizeRoles("hod", "technical officer"),
  updateEquipment
);

router.delete(
  "/equipmentImage/:id",
  authenticateToken,
  authorizeRoles("hod", "technical officer"),
  deleteEquipment
);

// Example query parameters for routes:
// GET /equipmentImage?page=1&limit=10&Lab=Lab1&Category=Electronics&search=microscope&sortBy=Name&sortOrder=desc&condition=good
// GET /equipmentImage/stats - Returns statistics about equipment conditions and availability
// GET /equipmentImage/:id - Returns equipment details with related items

module.exports = router;
