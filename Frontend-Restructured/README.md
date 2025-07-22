# Frontend - Clean Architecture

This is a restructured version of the Frontend with a clean, maintainable file organization.

## 📁 Project Structure

```
Frontend-Restructured/
├── public/                     # Static assets
├── src/
│   ├── assets/                # Static assets (images, icons, etc.)
│   │   └── images/
│   ├── components/            # Reusable UI components
│   │   ├── cards/            # Card components (DashCards, etc.)
│   │   ├── common/           # Common/shared components
│   │   ├── forms/            # Form components
│   │   ├── modals/           # Modal components
│   │   └── tables/           # Table components
│   ├── constants/            # Application constants
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Layout components (SideNavigation, etc.)
│   ├── pages/               # Page components organized by feature
│   │   ├── auth/            # Authentication pages (Login, Home)
│   │   ├── booking/         # Booking-related pages
│   │   ├── consumables/     # Consumables management pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── equipment/       # Equipment management pages
│   │   ├── reports/         # Reports pages
│   │   └── users/           # User management pages
│   ├── services/            # API services and auth
│   ├── styles/              # CSS/styling files
│   │   ├── components/      # Component-specific styles
│   │   └── pages/           # Page-specific styles
│   └── utils/               # Utility functions and helpers
└── package.json
```

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
- **Pages**: Full page components that represent routes
- **Components**: Reusable UI building blocks
- **Services**: API calls and business logic
- **Utils**: Pure utility functions
- **Styles**: All CSS organized by component/page

### 2. **Feature-Based Organization**
Pages are organized by feature/domain:
- `auth/` - Authentication and landing pages
- `equipment/` - Equipment management functionality
- `users/` - User management functionality
- `booking/` - Booking system
- `consumables/` - Consumables management
- `reports/` - Reporting features

### 3. **Component Categories**
Components are organized by type:
- `common/` - Shared/reusable components
- `forms/` - Form-specific components
- `tables/` - Data table components
- `cards/` - Card/widget components
- `modals/` - Modal/popup components

## 🚀 Benefits of This Structure

1. **Scalability**: Easy to add new features without cluttering
2. **Maintainability**: Clear separation makes code easier to find and modify
3. **Reusability**: Components are properly categorized for reuse
4. **Team Collaboration**: Clear structure helps team members navigate
5. **Testing**: Easier to write and organize tests
6. **Bundle Optimization**: Better tree-shaking and code splitting opportunities

## 📝 Import Guidelines

### Using Index Files
Each component category has an index.js file for cleaner imports:

```javascript
// Instead of:
import Profile from './components/common/Profile';
import Activity from './components/common/Activity';

// Use:
import { Profile, Activity } from './components/common';
```

### Page Imports
Pages should be imported with their full path for clarity:

```javascript
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
```

## 🎨 Styling Organization

- **Global styles**: In `styles/` root
- **Component styles**: In `styles/components/`
- **Page styles**: In `styles/pages/`

## 🔧 Development Guidelines

1. **New Components**: Place in appropriate category under `components/`
2. **New Pages**: Create in relevant feature folder under `pages/`
3. **Utilities**: Add to `utils/` with clear naming
4. **Services**: Organize by domain (auth, equipment, etc.)
5. **Constants**: Keep in `constants/` folder

## 📦 Migration Notes

This structure maintains backward compatibility while providing a cleaner organization. All original functionality is preserved with updated import paths in `App.jsx`.

## 🏃‍♂️ Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Build for production: `npm run build`

## 🧪 Testing

Tests should be organized parallel to the source structure:
- Component tests: `__tests__/components/`
- Page tests: `__tests__/pages/`
- Service tests: `__tests__/services/`

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
