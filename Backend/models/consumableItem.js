const mongoose = require("mongoose");

const consumableItemSchema = new mongoose.Schema(
  {
    Name: { 
      type: String, 
      required: true 
    },
    Category: { 
      type: String, 
      required: true 
    },
    Lab: { 
      type: String, 
      required: true 
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
      required: true,
      default: 10
    },
    Unit: {
      type: String,
      required: true,
      enum: ['pieces', 'meters', 'rolls', 'packets']
    },
    StorageLocation: {
      type: String,  // Like cabinet number, shelf number, etc.
      required: true
    },
    imageUrl: { 
      type: String,
      default: "default"
    },
    Notes: String
  },
  { timestamps: true }
);

// Add indexes for commonly queried fields
consumableItemSchema.index({ Lab: 1 });
consumableItemSchema.index({ Category: 1 });
consumableItemSchema.index({ Name: 'text' });
consumableItemSchema.index({ Quantity: 1 });

// Virtual for stock status
consumableItemSchema.virtual('stockStatus').get(function() {
  if (this.Quantity === 0) return 'out_of_stock';
  if (this.Quantity <= this.MinimumQuantity) return 'low_stock';
  return 'in_stock';
});

const ConsumableItem = mongoose.model("ConsumableItem", consumableItemSchema);
module.exports = ConsumableItem;