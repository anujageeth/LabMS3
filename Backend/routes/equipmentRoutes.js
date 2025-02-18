const express = require("express");

const {
  addEquipment,
  getEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentById,
  upload,
} = require("../controllers/newEquipmentController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Equipment routes
router.post(
  "/equipmentImage",
  authenticateToken,
  authorizeRoles("hod", "technical officer"),
  upload.single("image"), // Only HOD and Technical Officer
  addEquipment
);

router.get("/equipmentImage", getEquipment); // All roles can view equipment

router.put(
  "/equipmentImage/:id",
  authenticateToken,
  authorizeRoles("hod", "technical officer"), // Only HOD and Technical Officer
  updateEquipment
);

router.delete(
  "/equipmentImage/:id",
  authenticateToken,
  authorizeRoles("hod", "technical officer"), // Only HOD and Technical Officer
  deleteEquipment
);
router.get("/equipmentImage/:id", getEquipmentById);

module.exports = router;
