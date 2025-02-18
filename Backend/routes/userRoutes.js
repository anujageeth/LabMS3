const express = require("express");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getOneUser,
} = require("../controllers/userController");

const router = express.Router();

// Add a new user (Only HOD and Technical Officer)
router.post(
  "/users",
  authenticateToken,
  authorizeRoles("hod", "technical officer"),
  addUser
);

// Get all users (Only HOD and Technical Officer)
router.get(
  "/users",
  authenticateToken,
  authorizeRoles("hod", "technical officer"),
  getAllUsers
);

// Update a user by ID (Only HOD and Technical Officer)
router.put(
  "/users/:id",
  authenticateToken,
  authorizeRoles("hod", "technical officer"),
  updateUser
);

// Delete a user by ID (Only HOD and Technical Officer)
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRoles("hod", "technical officer"),
  deleteUser
);

//const router = require("express").Router();
const multer = require("multer");
const csv = require("csv-parser");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const stream = require("stream");
//const user = require("../models/user");

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Bulk import endpoint
// router.post("/users/bulk-import",
//   authenticateToken,
//   authorizeRoles("technical officer", "hod"),
//   multer().single("csv"),
//   async (req, res) => {
//     const results = [];
//     const errors = [];
//     //const bufferStream = new stream.PassThrough();
//     //bufferStream.end(req.file.buffer);

//     let csvBuffer = req.file.buffer;
//     // if (csvBuffer.slice(0, 3).toString() === '\ufeff') {
//     //   csvBuffer = csvBuffer.slice(3);
//     // }

//     const bufferStream = new stream.PassThrough();
//     bufferStream.end(csvBuffer);


//     bufferStream
//       .pipe(csv())
//       .on("data", async (row) => {
//         try {
//           // Generate default password
//           const username = row.Email.split("@")[0];
//           const tempPassword = `${username}@${Math.random().toString(36).slice(-4)}`;
//           const hashedPassword = await bcrypt.hash(tempPassword, 10);
//           res.send("Password updated successfully");

//           // Create user object
//           const userData = {
//             FirstName: row.FirstName,
//             LastName: row.LastName,
//             Title: row.Title,
//             Email: row.Email,
//             Role: row.Role,
//             Password: hashedPassword,
//             temporaryPassword: true
//           };

//           // Add student-specific fields
//           if (row.Role === "student") {
//             userData.studentId = row.StudentID;
//           }

//           // Save user
//           const user = new User(userData);
//           await user.save();

//           //// Send email
//           // await transporter.sendMail({
//           //   to: row.Email,
//           //   subject: "Your Lab System Credentials",
//           //   html: `<p>Welcome to the Lab Management System!</p>
//           //         <p>Username: ${row.Email}</p>
//           //         <p>Temporary Password: ${tempPassword}</p>
//           //         <p>Please change your password after first login.</p>`
//           // });

//           results.push({ success: true, email: row.Email });
//         } catch (error) {
//           errors.push({ error: error.message, row });
//         }
//       })
//       .on("end", () => {
//         res.status(207).json({
//           successCount: results.length,
//           errorCount: errors.length,
//           results,
//           errors
//         });
//       });
//   }
// );
const { pipeline } = require('stream/promises');
const User = require("../models/user");
router.post("/users/bulk-import",
  authenticateToken,
  authorizeRoles("technical officer", "hod"),
  multer().single("csv"),
  async (req, res) => {
    const results = [];
    const errors = [];
    try {
      let csvData = req.file.buffer.toString().replace(/^\uFEFF/, '');
      const cleanedCSV = csvData.split('\n').filter(line => line.trim()).join('\n');

      await pipeline(
        stream.Readable.from(cleanedCSV),
        csv({ strict: true }),
        new stream.Writable({
          objectMode: true,
          write: async (row, _, callback) => {
            try {
              // Your processing logic here
              if (!row.Email?.includes('@')) {
                throw new Error(`Invalid email format: ${row.Email}`);
              }
              
              // 4. Debugging log
              console.log('Processing row:', JSON.stringify(row));

              // Rest of your processing logic...
              const username = row.Email.split('@')[0];
              //console.log('Generated username:', username);
              //const tempPassword = `${username}@${Math.random().toString(36).slice(-4)}`;
              const hashedPassword = await bcrypt.hash(username, 10);
            // console.log("Password updated successfully");

              // Create user object
              const userData = {
                FirstName: row.FirstName,
                LastName: row.LastName,
                Title: row.Title,
                Email: row.Email,
                Role: row.Role,
                Password: hashedPassword,
                temporaryPassword: true
              };
              //console.log('Generated user data:', JSON.stringify(userData));
              //const user = new User(userData);
              // Add student-specific fields
              if (row.Role === "student") {
                userData.studentId = row.StudentID;
              }
              const user = new User(userData);
              await user.save();
                            // Send email
              // await transporter.sendMail({
              //   to: row.Email,
              //   subject: "Your Lab System Credentials",
              //   html: `<p>Welcome to the Lab Management System!</p>
              //         <p>Username: ${row.Email}</p>
              //         <p>Temporary Password: ${username}</p>
              //         <p>Please change your password after first login.</p>`
              // });
              results.push({ success: true, email: row.Email });
              callback();
            } catch (error) {
              errors.push({ error: error.message, row });
              callback();
            }
          }
        })
      );

      res.status(207).json({
        successCount: results.length,
        errorCount: errors.length,
        results,
        errors
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    
    // // 1. Remove BOM character more robustly
    // let csvData = req.file.buffer.toString();
    // csvData = csvData.replace(/^\uFEFF/, ''); // Regex BOM removal
    
    // // 2. Clean empty lines
    // const cleanedCSV = csvData
    //   .split('\n')
    //   .filter(line => line.trim() !== '')
    //   .join('\n');

    // const bufferStream = new stream.PassThrough();
    // bufferStream.end(cleanedCSV);

    // bufferStream
    //   .pipe(csv({
    //     strict: true, // Rejects mismatched column counts
    //     skipLines: 0 // No lines to skip
    //   }))
    //   .on('data', async (row) => {
    //     try {
    //       // 3. Enhanced validation
    //       if (!row.Email?.includes('@')) {
    //         throw new Error(`Invalid email format: ${row.Email}`);
    //       }
          
    //       // 4. Debugging log
    //       console.log('Processing row:', JSON.stringify(row));

    //       // Rest of your processing logic...
    //       const username = row.Email.split('@')[0];
    //       //console.log('Generated username:', username);
    //       const tempPassword = `${username}@${Math.random().toString(36).slice(-4)}`;
    //       const hashedPassword = await bcrypt.hash(tempPassword, 10);
    //      // console.log("Password updated successfully");

    //       // Create user object
    //       const userData = {
    //         FirstName: row.FirstName,
    //         LastName: row.LastName,
    //         Title: row.Title,
    //         Email: row.Email,
    //         Role: row.Role,
    //         Password: hashedPassword,
    //         temporaryPassword: true
    //       };
    //       //console.log('Generated user data:', JSON.stringify(userData));

    //       // Add student-specific fields
    //       if (row.Role === "student") {
    //         userData.studentId = row.StudentID;
    //       }

    //       // Save user
    //       const user = new User(userData);
    //       console.log('Saving user:', JSON.stringify(user));
    //       await user.save();
    //       // ... existing code ...

    //       results.push({ success: true, email: row.Email });
    //       console.log('User saved successfully:', results.length);
    //     } catch (error) {
    //       errors.push({ 
    //         error: error.message,
    //         row: JSON.parse(JSON.stringify(row)) // Safe serialization
    //       });
    //     }
    //   })
    //   .on('end', () => {
    //     res.status(207).json({
    //       successCount: results.length,
    //       errorCount: errors.length,
    //       results,
    //       errors
    //     });
    //   })
    //   .on('error', (err) => {
    //     res.status(400).json({
    //       error: `CSV parsing failed: ${err.message}`
    //     });
    //   });
  }
);
router.post("/change-password",
  authenticateToken,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const validPassword = await bcrypt.compare(req.body.oldPassword, user.Password);
      
      if (!validPassword) {
        return res.status(400).send("Invalid current password");
      }

      user.Password = await bcrypt.hash(req.body.newPassword, 10);
      user.temporaryPassword = false;
      user.lastPasswordChange = new Date();
      await user.save();

      res.send("Password updated successfully");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

router.get("/users/me", authenticateToken, getOneUser);

module.exports = router;
