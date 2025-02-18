// models/EquipmentTransaction.js
const mongoose = require('mongoose');

const equipmentItemSchema = new mongoose.Schema({
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  serialNumber: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    enum: ['GOOD', 'DAMAGED', 'NEEDS_MAINTENANCE'],
    default: 'GOOD'
  },
  damageNotes: String
});

const equipmentTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userDetails: {
    firstName: String,
    lastName: String,
    title: String,
    email: String
  },
  equipmentItems: [equipmentItemSchema],
  transactionType: {
    type: String,
    enum: ['CHECKIN', 'CHECKOUT'],
    required: true
  },
  checkoutDate: Date,
  expectedReturnDate: Date,
  checkinDate: Date,
  status: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'COMPLETED', 'OVERDUE'],
    default: 'ACTIVE'
  },
  notes: String
}, {
  timestamps: true
});

// routes/equipment-transactions.js
const express = require('express');
const router = express.Router();
const Equipment = require('../models/equipment');
//const EquipmentTransaction = require('../models/EquipmentTransaction');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/checkout', authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { equipmentItems, expectedReturnDate, notes } = req.body;
    const user = await User.findById(req.user.userId);

    // Validate all equipment items exist and are available
    for (const item of equipmentItems) {
      const equipment = await Equipment.findOne({
        _id: item.equipmentId,
        Serial: item.serialNumber,
        Availability: true
      });

      if (!equipment) {
        throw new Error(`Equipment with serial ${item.serialNumber} not available`);
      }
    }

    // Create checkout transaction
    const transaction = new EquipmentTransaction({
      userId: user._id,
      userDetails: {
        firstName: user.FirstName,
        lastName: user.LastName,
        title: user.Title,
        email: user.Email
      },
      equipmentItems,
      transactionType: 'CHECKOUT',
      checkoutDate: new Date(),
      expectedReturnDate,
      notes
    });

    await transaction.save({ session });

    // Update equipment availability
    for (const item of equipmentItems) {
      await Equipment.findOneAndUpdate(
        { _id: item.equipmentId, Serial: item.serialNumber },
        { Availability: false },
        { session }
      );
    }

    await session.commitTransaction();
    res.json(transaction);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
});

router.post('/checkin', authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { equipmentItems, notes } = req.body;

    // Find the original checkout transaction
    const checkoutTransaction = await EquipmentTransaction.findOne({
      'equipmentItems.serialNumber': { $in: equipmentItems.map(item => item.serialNumber) },
      transactionType: 'CHECKOUT',
      status: 'ACTIVE'
    });

    if (!checkoutTransaction) {
      throw new Error('No active checkout found for these items');
    }

    // Create checkin transaction
    const transaction = new EquipmentTransaction({
      userId: req.user.userId,
      userDetails: checkoutTransaction.userDetails,
      equipmentItems,
      transactionType: 'CHECKIN',
      checkinDate: new Date(),
      notes
    });

    await transaction.save({ session });

    // Update equipment status based on condition
    for (const item of equipmentItems) {
      const updateData = { Availability: true };
      
      if (item.condition !== 'GOOD') {
        updateData.status = item.condition;
      }

      await Equipment.findOneAndUpdate(
        { _id: item.equipmentId, Serial: item.serialNumber },
        updateData,
        { session }
      );
    }

    // Update checkout transaction status
    checkoutTransaction.status = 'COMPLETED';
    await checkoutTransaction.save({ session });

    await session.commitTransaction();
    res.json(transaction);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;