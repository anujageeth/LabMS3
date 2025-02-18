const mongoose = require("mongoose");

// const equipmentSchema = new mongoose.Schema({
//   Name: { type: String, required: true },
//   Lab: { type: String, required: true },
//   Category: { type: String, required: true }, // Replaced Category with a simple string field
//   Brand: { type: String, required: true },
//   Availability: { type: Boolean, required: true },
//   Quantity: { type: Number, required: true },
//   imageUrl: { type: String, required: true },
// });

// const equipmentSchema = new mongoose.Schema(
//   {
//     Name: { type: String, required: true },
//     Lab: { type: String, required: true },
//     Category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },
//     Brand: { type: String, required: true },
//     Availability: { type: Boolean, required: true },
//     Quantity: { type: Number, required: true },
//     imageUrl: { type: String, required: true },
//   },
//   { timestamps: true }
// );

const equipmentSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Category: { type: String, required: true },
    Brand: { type: String, required: true },
    Lab: { type: String, required: true },
    Serial: { type: String, unique: true, required: true },
    uniqueId: { type: String, unique: true },
    imageUrl: { type: String, required: true },
    Availability: { type: Boolean, required: true },
    condition: {
      type: String,
      enum: ["good", "damaged"],
      default: "good"
    }
  },
  { timestamps: true }
);
equipmentSchema.pre('save', function (next) {
  if (!this.uniqueId) {
    this.uniqueId = `${this.Category}/${this.Name}/${this.Brand}/${this.serial}`;
  }
  next();
});


const Equipment = mongoose.model("Equipment", equipmentSchema);
module.exports = Equipment;
