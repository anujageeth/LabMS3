const mongoose = require("mongoose");

const consumableItemSchema = new mongoose.Schema(
  {
    Name: { 
      type: String, 
      required: true,
      trim: true
    },
    Category: { 
      type: String, 
      required: true,
      trim: true
    },
    Lab: { 
      type: String, 
      required: true,
      trim: true
    },
    Specifications: {
      type: Map,
      of: String,
      default: {}  // For storing specs like voltage, current, etc.
    },
    Quantity: {
      type: Number,
      required: true,
      min: 0
    },
    MinimumQuantity: {
      type: Number,
      required: false,
      min: 0
    },
    Unit: {
      type: String,
      required: false,
      enum: ['pcs', 'meters', 'grams', 'liters', 'boxes', 'packs', 'rolls']
    },
    StorageLocation: {
      type: String,
      required: false,
      trim: true
    },
    Notes: String,
    Status: {
      type: String,
      enum: ['in-stock', 'low-stock', 'out-of-stock'],
      default: 'in-stock'
    },
    LastRestocked: {
      type: Date
    }
  },
  { timestamps: true }
);

// Add indexes for commonly queried fields
consumableItemSchema.index({ Lab: 1 });
consumableItemSchema.index({ Category: 1 });
consumableItemSchema.index({ Name: 'text' });
consumableItemSchema.index({ Quantity: 1 });
consumableItemSchema.index({ Status: 1 });

// Pre-save middleware to update status based on quantity
consumableItemSchema.pre('save', function(next) {
  if (this.Quantity <= 0) {
    this.Status = 'out-of-stock';
  } else if (this.Quantity <= this.MinimumQuantity) {
    this.Status = 'low-stock';
  } else {
    this.Status = 'in-stock';
  }
  next();
});

const ConsumableItem = mongoose.model("ConsumableItem", consumableItemSchema);
module.exports = ConsumableItem;