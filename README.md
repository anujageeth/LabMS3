# 🧪 Laboratory Management System (LabMS)

A comprehensive web-based Laboratory Management System developed for the Electrical Department to manage laboratory equipment, session bookings, users and reports. This project supports multiple user roles and includes features like real-time notifications, low stock alerts, and role-based access.

---

## 🚀 Features

- 🔐 **Role-Based Access Control** (HOD, Technical Officers, Instructors, Lecturers, Students)
- 📦 **Equipment Management** with CRUD operations
- ⚠️ **Low Stock Alerts** for inventory control
- 📅 **Lab Booking System** with availability checking
- 📊 **Report Generation & Export**
- 🔍 **Search and Filter Equipment**
- 🔔 **Notification System**, including Telegram Bot integration
- 🧭 **Responsive UI with Side Navigation**
- 📁 **User Authentication & Session Management**

---

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS & Material UI
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

---

## 👥 User Roles & Permissions

| **Role**              | **Permissions**                                            |
|-----------------------|------------------------------------------------------------|
| Head of Department    | 🔓 Full access to everything                               |
| Technical Officer     | 🛠️ Manage equipment, bookings, and view reports            |
| Instructor            | 👀 View equipment, 📝 request bookings                      |
| Lecturer              | 👁️ View & request bookings, 📊 see reports                 |
| Student               | 📄 View available equipment & booking slots                |

