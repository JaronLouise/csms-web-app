# Services Feature Implementation

This document describes the new Services feature that has been added to the CSMS Web Application.

## Overview

The Services feature allows the application to showcase and manage three main services offered by the company:
1. **Sustainable Energy Solutions** - Renewable energy solutions including solar panels, wind energy, and energy storage
2. **Fabrication and Installation** - Professional fabrication and installation services for industrial equipment
3. **Research** - Cutting-edge research and development in renewable energy technologies

## Features Implemented

### Frontend
- **Services Page** (`/services`) - Public page displaying all active services
- **Admin Service Management** - Full CRUD operations for services
  - Service List (`/admin/services`) - View and manage all services
  - Service Form (`/admin/services/new`, `/admin/services/edit/:id`) - Create and edit services
- **Responsive Design** - Mobile-friendly layout with modern UI
- **Service Icons** - Visual representation using React Icons

### Backend
- **Service Model** - MongoDB schema for services
- **Service Controller** - API endpoints for service operations
- **Service Routes** - RESTful API routes
- **Database Seeding** - Script to populate default services

## API Endpoints

### Public Endpoints
- `GET /api/services` - Get all active services
- `GET /api/services/:id` - Get specific service by ID

### Admin Endpoints (Protected)
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update existing service
- `DELETE /api/services/:id` - Delete service

## Service Model Schema

```javascript
{
  name: String (required, unique),
  description: String (required),
  features: [String],
  icon: String (default: 'default-icon'),
  isActive: Boolean (default: true),
  timestamps: true
}
```

## Installation and Setup

### 1. Install Dependencies
```bash
# Install react-icons for the client
cd client
npm install react-icons

# Install server dependencies (if not already installed)
cd ../server
npm install
```

### 2. Seed the Database
```bash
# Run the seed script to populate default services
cd server
npm run seed
```

### 3. Start the Application
```bash
# Start the server
cd server
npm run dev

# Start the client (in a new terminal)
cd client
npm run dev
```

## Usage

### For Users
1. Navigate to `/services` to view all available services
2. Each service displays:
   - Service name and description
   - Key features list
   - Call-to-action buttons

### For Admins
1. Access admin dashboard at `/admin`
2. Click "Manage Services" to view all services
3. Use "Add New Service" to create services
4. Edit or delete existing services using the action buttons
5. Toggle service status (active/inactive)

## File Structure

```
├── client/src/
│   ├── pages/
│   │   ├── services.jsx              # Main services page
│   │   ├── services.css              # Services page styles
│   │   └── admin/
│   │       ├── AdminServiceList.jsx  # Admin service management
│   │       ├── AdminServiceList.css  # Admin list styles
│   │       ├── AdminServiceForm.jsx  # Service creation/editing
│   │       └── AdminServiceForm.css  # Admin form styles
│   ├── services/
│   │   └── serviceService.js         # API service functions
│   └── components/
│       └── Navbar.jsx                # Updated with services link
├── server/
│   ├── models/
│   │   └── Service.js                # Service database model
│   ├── controllers/
│   │   └── serviceController.js      # Service API logic
│   ├── routes/
│   │   └── services.js               # Service API routes
│   ├── app.js                        # Updated with service routes
│   ├── seedServices.js               # Database seeding script
│   └── package.json                  # Updated with seed script
```

## Default Services

The application comes with three pre-configured services:

### 1. Sustainable Energy Solutions
- **Description**: Comprehensive renewable energy solutions
- **Features**: Solar panels, wind energy, energy storage, audits, monitoring
- **Icon**: Solar panel

### 2. Fabrication and Installation
- **Description**: Professional fabrication and installation services
- **Features**: Custom machinery, industrial equipment, precision engineering
- **Icon**: Gears/cogs

### 3. Research
- **Description**: Cutting-edge research and development
- **Features**: Renewable energy research, materials development, innovation
- **Icon**: Laboratory flask

## Customization

### Adding New Services
1. Use the admin interface to create new services
2. Or modify the `seedServices.js` file and re-run the seed script

### Modifying Service Icons
The application supports these icon types:
- `solar` - Solar panel icon
- `fabrication` - Gears/cogs icon
- `research` - Laboratory flask icon
- `default-icon` - Generic icon

### Styling
- Modify `services.css` for the public services page
- Modify `AdminServiceList.css` and `AdminServiceForm.css` for admin styling

## Security

- All admin operations require authentication and admin privileges
- Service creation, updates, and deletion are protected by middleware
- Public endpoints only return active services

## Future Enhancements

Potential improvements for the services feature:
- Service categories/tags
- Service images/gallery
- Service testimonials/reviews
- Service booking/inquiry forms
- Service pricing information
- Service availability scheduling 