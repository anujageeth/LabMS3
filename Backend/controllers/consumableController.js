const ConsumableItem = require("../models/consumableItem");

// Get all consumable items with pagination
exports.getConsumables = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const items = await ConsumableItem.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await ConsumableItem.countDocuments();

    res.json({
      data: items,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search consumable items
exports.searchConsumables = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const items = await ConsumableItem.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit)
    .lean();

    const total = await ConsumableItem.countDocuments(
      { $text: { $search: query } }
    );

    res.json({
      data: items,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new consumable item
exports.addConsumableItem = async (req, res) => {
  try {
    const newItem = new ConsumableItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update consumable item
exports.updateConsumable = async (req, res) => {
  try {
    const updatedItem = await ConsumableItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete consumable item
exports.deleteConsumable = async (req, res) => {
  try {
    const deletedItem = await ConsumableItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, action } = req.body; // action: 'add' or 'subtract'

    const item = await ConsumableItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (action === 'add') {
      item.Quantity += quantity;
      item.LastRestocked = new Date();
    } else if (action === 'subtract') {
      if (item.Quantity < quantity) {
        return res.status(400).json({ message: "Insufficient quantity" });
      }
      item.Quantity -= quantity;
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res) => {
  try {
    const items = await ConsumableItem.find({
      Status: { $in: ['low-stock', 'out-of-stock'] }
    }).sort({ Quantity: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};