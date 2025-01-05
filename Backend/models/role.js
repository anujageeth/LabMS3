const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  //RoleID: { type: mongoose.Schema.Types.ObjectId, required: true },
  Name: { type: String, required: true },
  Permission: { type: String, required: true },
});

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
