const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware to authenticate users based on JWT token
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer Token
  if (!token) return res.status(401).send("Access denied. No token provided.");

  jwt.verify(token, process.env.JWT_SECRET, (err, jwtPayload) => {
    if (err) return res.status(403).send("Invalid token.");
    req.user = jwtPayload;
    next();
  });
}

// Middleware to authorize based on role
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send("Access denied. You do not have permission.");
    }
    next();
  };
}

const isAdmin = async (req, res, next) => {
  try {
    // Ensure req.user is set by authenticateToken
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ 
        message: "Access denied. User not authenticated." 
      });
    }

    // Check if the user exists and has an admin role
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }
    
    // Check if the user has an admin role
    if (user.Role === "hod" || user.Role === "technical officer") {
      next();
    } else {
      return res.status(403).json({ 
        message: "Access denied. Admin privileges required." 
      });
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ 
      message: "Server error during admin verification",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { 
  authenticateToken, 
  authorizeRoles,
  isAdmin 
};


/*
const jwt = require("jsonwebtoken");

// Middleware to authenticate users based on JWT token
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer Token
  if (!token) return res.status(401).send("Access denied. No token provided.");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token.");
    req.user = user;
    next();
  });
}

// Middleware to authorize based on role
const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      // Ensure req.user is set by authenticateToken
      if (!req.user || !req.user.userId) {
        return res.status(401).send("Access denied. User not authenticated.");
      }

      // Fetch user from database
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).send("User not found.");
      }

      console.log("User Role:", user.Role); // Debug log

      // Check if user's role is allowed
      if (!roles.includes(user.Role)) {
        return res
          .status(408)
          .send("Access denied. You do not have permission.");
      }

      next(); // User is authorized
    } catch (error) {
      console.error("Authorization Error:", error);
      res.status(500).send("Server error during authorization.");
    }
  };
};

module.exports = { authenticateToken, authorizeRoles };
*/