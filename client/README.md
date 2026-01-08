# BookMyAdvocate - Frontend

React-based frontend application for BookMyAdvocate platform.

## Features

### For Users
- User registration and login
- Search advocates by specialization, location, and experience
- View advocate profiles with ratings and reviews
- Book online and offline consultations
- Track booking status
- Personal dashboard

### For Advocates
- Advocate registration with professional details
- Manage service offerings
- View and manage bookings
- Update consultation availability
- Professional dashboard

### For Admins
- Comprehensive admin dashboard
- Approve/reject advocate registrations
- Manage users and advocates
- View all bookings and statistics
- System analytics

## Tech Stack

- **React** 18.2.0
- **React Router** 6.20.0
- **Axios** for API calls
- **React Toastify** for notifications
- **React Icons** for UI icons
- **date-fns** for date handling

## Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── PrivateRoute.js
│   │   └── LoadingSpinner.js
│   ├── pages/            # Page components
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── AdvocateRegister.js
│   │   ├── SearchAdvocates.js
│   │   ├── AdvocateDetails.js
│   │   ├── UserDashboard.js
│   │   ├── AdvocateDashboard.js
│   │   ├── AdminDashboard.js
│   │   ├── MyBookings.js
│   │   └── Profile.js
│   ├── context/          # Context providers
│   │   └── AuthContext.js
│   ├── services/         # API services
│   │   ├── api.js
│   │   └── index.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## Available Scripts

- `npm start` - Run development server
- `npm build` - Create production build
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Key Features Implementation

### Authentication
- JWT-based authentication
- Protected routes based on user roles
- Persistent login with localStorage

### Search & Discovery
- Advanced advocate search with filters
- Specialization-based filtering
- Location and experience filters
- Rating and review system

### Booking System
- Online and offline consultation booking
- Date and time selection
- Booking status tracking
- Service type selection

### Dashboard Features
- **User Dashboard**: Quick access to bookings and search
- **Advocate Dashboard**: Service management, booking management
- **Admin Dashboard**: Complete system overview and management

## API Integration

All API calls are centralized in the `services` folder:
- `authService` - Authentication operations
- `advocateService` - Advocate-related operations
- `serviceService` - Service management
- `bookingService` - Booking operations
- `reviewService` - Review and rating operations
- `adminService` - Admin operations

## Styling

- Custom CSS with component-level stylesheets
- Responsive design for mobile and desktop
- Consistent color scheme and typography
- Reusable CSS classes for common patterns

## Environment Variables

- `REACT_APP_API_URL` - Backend API base URL

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code structure
2. Use functional components with hooks
3. Keep components modular and reusable
4. Add comments for complex logic
5. Test on multiple screen sizes

## License

Copyright © 2025 BookMyAdvocate. All rights reserved.
