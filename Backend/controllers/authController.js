const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const registerUser = async (req, res) => {
  try {
    const { FirstName, LastName, Title, Email, Role, Password } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    console.log(req.body);

    const user = new User({
      FirstName,
      LastName,
      Title,
      Email,
      Password: hashedPassword,
      Role,
      // Add StudentID for students
    });

    await user.save();
    res.status(201).send("User registered successfully.");
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// const loginUser = async (req, res) => {
//   try {
//     const { Email, Password } = req.body;
//     const user = await User.findOne({ Email });

//     if (!user || !(await bcrypt.compare(Password, user.Password))) {
//       return res.status(400).send("Invalid email or password.");
//     }

//     const token = jwt.sign(
//       { userId: user._id, role: user.Role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.send({ token });
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// };

// authController.js, loginUser function
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Changed Email to email, Password to password

    // Find user by email
    const user = await User.findOne({ Email: email });
    if (!user) {
      return res.status(400).json({ error: `Invalid email ${email}` });
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Send token and user data back to the frontend
    res.json({
      token,
      user: {
        _id: user._id,
        Email: user.Email,
        FirstName: user.FirstName,
        Role: user.Role,
      },
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
