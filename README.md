# Hotel Management System

A comprehensive backend system for hotel management built with Node.js, Express, and MongoDB.

## 🚀 Features

### ✅ Completed Modules
- **Room Management** (Saad) - CRUD operations for hotel rooms
- **User Management** (Noman) - Admin features and role-based access
- **Booking System** (Noman) - Reservation with check-in/check-out
- **Services Management** (Noman) - Extra services like laundry, taxi, spa
- **Analytics & Reports** (Noman) - Daily/monthly reports, occupancy rates
- **Authentication & Authorization** - JWT-based security with role control

### ✅ Completed Modules
- **User Authentication** (Ahmed) - Login/Register system

✅ Completed
- **Validation** (Ahmed) - Input validation and sanitization

## 🏗️ Project Structure

```
├── controllers/          # Business logic
│   ├── roomController.js
│   ├── bookingController.js
│   ├── userController.js
│   ├── serviceController.js
│   └── analyticsController.js
├── db/                  # Database connection
│   └── index.js
├── middlewares/         # Custom middleware
│   ├── uploadMiddleware.js
│   └── authMiddleware.js
├── models/              # Database schemas
│   ├── room.js
│   ├── booking.js
│   ├── service.js
│   └── user.js
├── routes/              # API endpoints
│   ├── roomRoutes.js
│   ├── bookingRoutes.js
│   ├── userRoutes.js
│   ├── serviceRoutes.js
│   └── analyticsRoutes.js
├── seed/                # Sample data
│   ├── seedRooms.js
│   └── seedServices.js
└── uploads/             # File storage
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hotel-Management-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```env
   MONGO_URI=mongodb://localhost:27017/hotel-management
   PORT=3000
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

5. **Seed sample data**
   ```bash
   npm run seed:rooms
   npm run seed:services
   ```

6. **Run the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Endpoints

### 🔐 Authentication Required
All protected routes require `Authorization: Bearer <token>` header.

### 🏠 Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create new room (Admin)
- `GET /api/rooms/:id` - Get room by ID
- `PUT /api/rooms/:id` - Update room (Admin)
- `DELETE /api/rooms/:id` - Delete room (Admin)

### 📅 Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking (Customer)
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id` - Update booking (Admin)
- `DELETE /api/bookings/:id` - Delete booking (Admin)
- `POST /api/bookings/:id/checkin` - Check-in (Admin)
- `POST /api/bookings/:id/checkout` - Check-out (Admin)

### 👥 Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `GET /api/users/profile/me` - Get own profile

### 🎯 Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (Admin)
- `GET /api/services/:id` - Get service by ID
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)
- `GET /api/services/popular` - Get popular services

### 📊 Analytics (Admin Only)
- `GET /api/analytics/daily-bookings` - Daily bookings report
- `GET /api/analytics/monthly-bookings` - Monthly bookings report
- `GET /api/analytics/occupancy-rate` - Room occupancy analytics
- `GET /api/analytics/revenue` - Revenue tracking

## 🔒 Role-Based Access Control

### 👤 Customer
- Create/view own bookings
- View available rooms and services
- Access own profile

### 👨‍💼 Admin
- Full access to all features
- Manage users, rooms, bookings
- View analytics and reports
- Manage extra services

## 📊 Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  role: "customer" | "admin",
  status: "active" | "inactive" | "suspended",
  phone: String,
  address: String,
  profileImage: String
}
```

### Room
```javascript
{
  roomNumber: String (unique),
  roomType: "Single" | "Double" | "Triple" | "Quad",
  description: String,
  pricePerNight: Number,
  status: "available" | "booked" | "maintenance",
  amenities: [String],
  images: [String]
}
```

### Booking
```javascript
{
  room: [ObjectId (ref: Room)],
  user: ObjectId (ref: User),
  checkInDate: Date,
  checkOutDate: Date,
  totalPrice: Number,
  status: "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled",
  extraServices: [ObjectId (ref: Service)]
}
```

### Service
```javascript
{
  name: String,
  price: Number,
  description: String
}
```

## 🚀 Usage Examples

### Create a Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "room": "room_id_here",
    "checkInDate": "2024-01-15",
    "checkOutDate": "2024-01-17",
    "extraServices": ["service_id_1", "service_id_2"]
  }'
```

### Check-in a Guest
```bash
curl -X POST http://localhost:3000/api/bookings/booking_id_here/checkin \
  -H "Authorization: Bearer <admin_token>"
```

### Get Daily Analytics
```bash
curl -X GET "http://localhost:3000/api/analytics/daily-bookings?date=2024-01-15" \
  -H "Authorization: Bearer <admin_token>"
```

## 🧪 Testing

### Seed Data
```bash
# Seed rooms
npm run seed:rooms

# Seed services
npm run seed:services
```

### Environment Variables
Make sure to set up your `.env` file with:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)

## 🤝 Contributing

### Team Members
- **Saad** - Room Management & CRUD
- **Ahmed** - User Authentication & Validation
- **Noman** - User Management, Booking System, Analytics, Services

### Development Rules
1. Don't overwrite existing modules
2. Follow the established folder structure
3. Use proper authentication middleware
4. Implement role-based access control
5. Add comprehensive error handling

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check existing documentation
2. Review API endpoints
3. Check server logs
4. Verify environment variables
5. Ensure MongoDB is running

---

**Built with ❤️ by the Hotel Management Team**
