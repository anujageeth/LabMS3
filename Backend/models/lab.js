const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  //Category: { type: mongoose.Schema.Types.ObjectId, required: true },
  Description: { type: String, required: true },
  Name: { type: String, unique: true, required: true },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
