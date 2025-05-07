# Lab Management System Backend

This is the backend server for the Lab Management System.

## Deployment Guide

### Prerequisites

- Node.js 16.x or higher
- MongoDB database (local or cloud-based MongoDB Atlas)
- SMTP email account for notifications

### Environment Setup

Create a `.env` file in the root directory with the following:

```
# Database
MONGO_URI=mongodb+srv://your_connection_string
PORT=3001

# JWT Authentication
JWT_SECRET=your_secure_jwt_secret_key

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Default Admin (created if no admin exists)
DEFAULT_ADMIN_FIRSTNAME=Admin
DEFAULT_ADMIN_LASTNAME=User
DEFAULT_ADMIN_TITLE=Dr.
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=initial_password
```

### Installation and Setup

1. Install dependencies:
```
npm install
```

2. Start the server in production mode:
```
npm start
```

3. For development with auto-restart:
```
npm run dev
```

## API Routes

The API is available at `/api` with the following main endpoints:

- Authentication: `/api/login`, `/api/register`
- Users: `/api/users`
- Equipment: `/api/equipmentImage`
- Lab Bookings: `/api/bookings`
- Check-in/Check-out: Tracks equipment usage
- Notifications: System notifications
- Reports: Generate usage reports

## Email Notifications

The system includes email notifications for:

1. Lab bookings and confirmations
2. Equipment check-in/check-out
3. Weekly damage reports
4. Upcoming lab reminders (sent daily at 6 PM)
5. Equipment maintenance alerts

### Email Configuration

For Gmail, use an App Password instead of your regular password:
- Go to your Google Account > Security > 2-Step Verification
- At the bottom, select "App passwords"
- Create a new app password for "Node.js" or "Other"
- Use the generated password in your .env file

## Scheduled Tasks

The system uses cron jobs for:
- Daily lab notifications (6:00 PM)
- Weekly equipment damage reports (Mondays at 9:00 AM)

## Recent Cleanup

The following improvements were made to prepare for deployment:

1. Fixed duplicate routes in server.js
2. Removed unused commented code
3. Fixed incorrect import paths in activityRoutes.js
4. Updated package.json with proper production start script
5. Added Node.js version requirement
6. Standardized indentation and formatting

## Maintenance Notes

Maintain a proper `.gitignore` file with:
- node_modules/
- .env
- logs/
- *.log
- serviceAccountKey.json
