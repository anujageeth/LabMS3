const ConsumableItem = require("../models/consumableItem");

const addConsumableItem = async (req, res) => {
  try {
    const {
      Name,
      Category,
      Lab,
      Specifications,
      Quantity,
      MinimumQuantity,
      Unit,
      StorageLocation,
      Notes
    } = req.body;

    const newItem = new ConsumableItem({
      Name,
      Category,
      Lab,
      Specifications,
      Quantity,
      MinimumQuantity,
      Unit,
      StorageLocation,
      Notes
    });

    await newItem.save();
    res.status(201).json({ 
      message: "Consumable item added successfully", 
      item: newItem 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateConsumable = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Name,
      Category,
      Lab,
      Specifications,
      Quantity,
      MinimumQuantity,
      Unit,
      StorageLocation,
      Notes,
      operation // for quantity adjustments
    } = req.body;

    const item = await ConsumableItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Handle quantity operations if specified
    if (operation && Quantity) {
      if (operation === 'add') {
        item.Quantity += Number(Quantity);
      } else if (operation === 'remove') {
        if (item.Quantity < Quantity) {
          return res.status(400).json({ message: "Insufficient quantity" });
        }
        item.Quantity -= Number(Quantity);
      } else if (operation === 'set') {
        item.Quantity = Number(Quantity);
      }
    }

    // Update other fields if provided
    if (Name) item.Name = Name;
    if (Category) item.Category = Category;
    if (Lab) item.Lab = Lab;
    if (Specifications) item.Specifications = Specifications;
    if (MinimumQuantity) item.MinimumQuantity = Number(MinimumQuantity);
    if (Unit) item.Unit = Unit;
    if (StorageLocation) item.StorageLocation = StorageLocation;
    if (Notes) item.Notes = Notes;

    // Validate minimum quantity
    if (item.Quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const updatedItem = await item.save();

    res.status(200).json({ 
      message: "Item updated successfully", 
      item: updatedItem,
      stockStatus: updatedItem.stockStatus
    });
  } catch (error) {
    console.error('Error updating consumable:', error);
    res.status(500).json({ 
      message: "Error updating item", 
      error: error.message 
    });
  }
};

const getConsumables = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      Lab,
      Category,
      search,
      stockStatus
    } = req.query;

    let filter = {};
    if (Lab) filter.Lab = Lab;
    if (Category) filter.Category = Category;
    if (search) {
      filter.$text = { $search: search };
    }
    if (stockStatus === 'low_stock') {
      filter.$expr = { $lte: ['$Quantity', '$MinimumQuantity'] };
    }

    const [items, total] = await Promise.all([
      ConsumableItem.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ConsumableItem.countDocuments(filter)
    ]);

    res.status(200).json({
      items,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addConsumableItem,
  updateConsumable, // Replace updateQuantity with updateConsumable
  getConsumables
};