const express = require('express');
const router = express.Router();
const { 
    addConsumableItem, 
    updateConsumable, 
    getConsumables 
} = require('../controllers/consumableController');
const { 
    authenticateToken, 
    authorizeRoles 
} = require('../middleware/authMiddleware');

// Base route for consumables
router.get(
    '/consumables', 
    authenticateToken, 
    getConsumables
);

// Add new consumable item - restricted to authorized roles
router.post(
    '/consumables', 
    authenticateToken,
    authorizeRoles('hod', 'technical officer'),
    addConsumableItem
);

// Update consumable item - restricted to authorized roles
router.patch(
    '/consumables/:id',
    authenticateToken,
    authorizeRoles('hod', 'technical officer'),
    updateConsumable
);

module.exports = router;