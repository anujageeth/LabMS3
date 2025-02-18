// models/EquipmentTransaction.js
const mongoose = require('mongoose');

const equipmentTransactionSchema = new mongoose.Schema({
  // Reference to the original equipment
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  // Equipment details at time of transaction
  equipmentDetails: {
    name: String,
    category: String,
    brand: String,
    serial: String,
    uniqueId: String
  },
  // User who checked out/in the equipment
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  // Transaction type
  transactionType: {
    type: String,
    enum: ['CHECKIN', 'CHECKOUT'],
    required: true
  },
  // Quantity taken/returned
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  // Check-out specific fields
  checkoutDate: {
    type: Date,
    required: function() { return this.transactionType === 'CHECKOUT'; }
  },
  expectedReturnDate: {
    type: Date,
    required: function() { return this.transactionType === 'CHECKOUT'; }
  },
  // Check-in specific fields
  checkinDate: {
    type: Date,
    required: function() { return this.transactionType === 'CHECKIN'; }
  },
  condition: {
    type: String,
    enum: ['GOOD', 'DAMAGED', 'NEEDS_MAINTENANCE'],
    required: function() { return this.transactionType === 'CHECKIN'; }
  },
  damageNotes: {
    type: String,
    required: function() { 
      return this.transactionType === 'CHECKIN' && this.condition !== 'GOOD';
    }
  },
  // General notes
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model("EquipmentTransaction", equipmentTransactionSchema);
