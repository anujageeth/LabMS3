const User = require("../models/user");
const bcrypt = require("bcryptjs");

// Add a new user (HOD and Technical Officer)
const addUser = async (req, res) => {
  try {
    const { FirstName, LastName, Title, Email, Role, Password } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      FirstName,
      LastName,
      Title,
      Email,
      Role,
      Password: hashedPassword,
      // StudentID: Role === "student" ? StudentID : undefined,
    });

    await newUser.save();
    res
      .status(201)
      .send({ message: "User added successfully.", user: newUser });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Retrieve all users (HOD and Technical Officer)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Update a user by ID (HOD and Technical Officer)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.Password) {
      updates.Password = await bcrypt.hash(updates.Password, 10); // Hash password if it's being updated
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found.");
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Delete a user by ID (HOD and Technical Officer)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.status(200).send({ message: "User deleted successfully." });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
const getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "user not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error ", error });
  }
};

module.exports = { addUser, getAllUsers, updateUser, deleteUser, getOneUser };
