const express = require('express');
const router = express.Router();
const { 
    addConsumableItem, 
    updateConsumable, 
    getConsumables,
    searchConsumables,
    deleteConsumable,
    updateQuantity,
    getLowStockItems
} = require('../controllers/consumableController');
const { 
    authenticateToken, 
    authorizeRoles 
} = require('../middleware/authMiddleware');

// Get all consumable items
router.get(
    '/', 
    authenticateToken, 
    getConsumables
);

// Search consumable items
router.get(
    '/search',
    authenticateToken,
    searchConsumables
);

// Add new consumable item
router.post(
    '/', 
    authenticateToken,
    authorizeRoles('hod', 'technical officer'),
    addConsumableItem
);

// Update consumable item
router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('hod', 'technical officer'),
    updateConsumable
);

// Delete consumable item
router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('hod', 'technical officer'),
    deleteConsumable
);

// Update quantity
router.patch(
    '/:id/quantity',
    authenticateToken,
    updateQuantity
);

// Get low stock items
router.get(
    '/low-stock',
    authenticateToken,
    getLowStockItems
);

module.exports = router;