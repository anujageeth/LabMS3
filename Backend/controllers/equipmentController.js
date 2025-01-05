const Equipment = require("../models/equipment");

// Add new equipment (Only HOD and Technical Officer)
const addEquipment = async (req, res) => {
  try {
    const { Name, Lab, Category, Brand, Availability, Quantity, imageUrl } =
      req.body;

    const newEquipment = new Equipment({
      Name,
      Lab,
      Category, // Use string for category
      Brand,
      Availability,
      Quantity,
      imageUrl, // added imageUrl
    });

    await newEquipment.save();
    res.status(201).send("Equipment added successfully.");
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Retrieve all equipment or filter by Lab and/or Category (All roles can view)
const getEquipment = async (req, res) => {
  try {
    const { Lab, Category } = req.query; // Get Lab and Category from query params

    let filter = {};
    if (Lab) {
      filter.Lab = Lab;
    }
    if (Category) {
      filter.Category = Category;
    }

    const equipment = await Equipment.find(filter).populate("Lab");
    res.status(200).send(equipment);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Update equipment (Only HOD and Technical Officer)
// const updateEquipment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     const equipment = await Equipment.findByIdAndUpdate(id, updates, {
//       new: true,
//     });

//     if (!equipment) {
//       return res.status(404).send("Equipment not found.");
//     }

//     res.status(200).send(equipment);
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// };

const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the equipment by ID
    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.status(404).send({ message: "Equipment not found" });
    }

    // Update the equipment with new data from the request body
    const updatedData = {
      Name: req.body.Name,
      Lab: req.body.Lab,
      Category: req.body.Category,
      Brand: req.body.Brand,
      Quantity: req.body.Quantity,
      Availability: req.body.Availability || equipment.Availability, // Assuming Availability is a boolean
    };

    // Update the equipment in the database
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true, // Return the updated document
      }
    );

    res.status(200).send({
      message: "Equipment updated successfully",
      equipment: updatedEquipment,
    });
  } catch (error) {
    console.error("Error updating equipment:", error);
    res
      .status(500)
      .send({ message: "Error updating equipment", error: error.message });
  }
};

// Delete equipment (Only HOD and Technical Officer)
const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findByIdAndDelete(id);

    if (!equipment) {
      return res.status(404).send("Equipment not found.");
    }

    res.status(200).send("Equipment deleted successfully.");
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  addEquipment,
  getEquipment,
  updateEquipment,
  deleteEquipment,
};
