# Lab Management System Backend

This is the backend server for the Lab Management System.

## Email Notifications for Lab Bookings

The system now includes email notifications for lab bookings:

1. When a user books a lab, Technical Officers are automatically notified via email
2. The notification includes:
   - Lab details (name, place, date, time)
   - User details (name, email, role)
   - Instructions for lab preparation

### Configuration

To enable email notifications:

1. Create a `.env` file in the Backend directory with the following:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
```

2. For Gmail, use an App Password instead of your regular password:
   - Go to your Google Account > Security > 2-Step Verification
   - At the bottom, select "App passwords"
   - Create a new app password for "Node.js" or "Other"
   - Use the generated password in your .env file

3. Restart the server after updating the .env file

## Installation and Setup

1. Install dependencies:
```
npm install
```

2. Start the server:
```
npm start
```
