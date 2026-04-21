# 🚌 BusGo — Full-Stack MERN Bus Ticket Booking System

A production-grade bus ticket booking system built with **MongoDB, Express.js, React.js, and Node.js**.

---

## 📁 Project Structure

```
bus-booking/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, GetMe
│   │   ├── busController.js    # Get buses, Search, Create
│   │   └── bookingController.js# Create, Cancel, Get bookings
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT protect + admin-only
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Bus.js              # Bus schema
│   │   └── Booking.js          # Booking schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── busRoutes.js
│   │   └── bookingRoutes.js
│   ├── scripts/
│   │   └── seedData.js         # 10 sample buses + admin user
│   ├── server.js               # Express entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js/css   # Responsive navbar
│   │   │   ├── Footer.js/css
│   │   │   ├── BusCard.js/css  # Bus listing card
│   │   │   ├── SeatGrid.js/css # Interactive 2x2 seat map
│   │   │   ├── SearchForm.js/css # Search form
│   │   │   └── Spinner.js
│   │   ├── context/
│   │   │   ├── AuthContext.js  # Global auth state
│   │   │   └── SearchContext.js# Shared search results
│   │   ├── pages/
│   │   │   ├── HomePage.js/css
│   │   │   ├── SearchResultsPage.js/css
│   │   │   ├── SeatSelectionPage.js/css
│   │   │   ├── BookingConfirmPage.js/css
│   │   │   ├── MyBookingsPage.js/css
│   │   │   ├── LoginPage.js
│   │   │   └── RegisterPage.js  (AuthPages.css)
│   │   ├── utils/
│   │   │   └── api.js          # Axios instance + all API calls
│   │   ├── App.js              # Routes + providers
│   │   ├── index.js
│   │   └── index.css           # Global design system
│   ├── .env
│   └── package.json
│
├── package.json                # Root with concurrently scripts
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local) or MongoDB Atlas account
- npm or yarn

---

### Step 1 — Clone & Install

```bash
# Install root dependencies
npm install

# Install all dependencies at once
npm run install-all
```

Or install manually:
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

---

### Step 2 — Configure Environment

Copy and edit the backend `.env`:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bus-booking
JWT_SECRET=your_super_secret_key_change_in_production_abc123xyz
JWT_EXPIRE=7d
NODE_ENV=development
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://username:password@cluster.mongodb.net/bus-booking`

---

### Step 3 — Seed Sample Data

```bash
npm run seed
# or
cd backend && npm run seed
```

This creates:
- ✅ **10 buses** across popular Indian routes
- ✅ **1 admin user**: `admin@busbook.com` / `admin123`

---

### Step 4 — Run the Application

```bash
# Run both frontend + backend simultaneously (from root)
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
cd backend && npm run dev   # Runs on http://localhost:5000

# Terminal 2 - Frontend
cd frontend && npm start    # Runs on http://localhost:3000
```

---

### Step 5 — Open in Browser

```
Frontend:  http://localhost:3000
Backend:   http://localhost:5000/api/health
```

---

## 🔑 Test Credentials

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@busbook.com    | admin123  |

Register as a new user or use the demo credentials on the login page.

---

## 🗺️ Sample Routes Available

| Route              | Bus Type    | Price |
|--------------------|-------------|-------|
| Mumbai → Pune      | AC Sleeper  | ₹450  |
| Bangalore → Chennai| AC Seater   | ₹650  |
| Delhi → Agra       | Semi-Sleeper| ₹350  |
| Ahmedabad → Mumbai | Sleeper     | ₹800  |
| Bangalore → Hyderabad | AC Sleeper | ₹950 |
| Delhi → Manali     | AC Sleeper  | ₹1500 |
| Mumbai → Goa       | Semi-Sleeper| ₹750  |
| Jaipur → Delhi     | AC Seater   | ₹550  |
| Pune → Nashik      | Seater      | ₹280  |
| Kochi → Bangalore  | Sleeper     | ₹1100 |

---

## 🌐 REST API Reference

### Auth
| Method | Endpoint               | Access  | Description          |
|--------|------------------------|---------|----------------------|
| POST   | /api/auth/register     | Public  | Register user        |
| POST   | /api/auth/login        | Public  | Login user           |
| GET    | /api/auth/me           | Private | Get current user     |

### Buses
| Method | Endpoint               | Access  | Description          |
|--------|------------------------|---------|----------------------|
| GET    | /api/buses             | Public  | Get all buses        |
| POST   | /api/buses/search      | Public  | Search buses         |
| GET    | /api/buses/:id         | Public  | Get bus + seat map   |
| POST   | /api/buses             | Admin   | Create a bus         |

### Bookings
| Method | Endpoint                    | Access  | Description        |
|--------|-----------------------------|---------|--------------------|
| POST   | /api/bookings               | Private | Create booking     |
| GET    | /api/bookings/my            | Private | Get my bookings    |
| GET    | /api/bookings/:id           | Private | Get single booking |
| PUT    | /api/bookings/:id/cancel    | Private | Cancel booking     |

---

## 🎨 Features

### User Features
- 🔐 JWT Authentication (register/login/logout)
- 🔍 Search buses by source, destination, date
- 🎛️ Filter by bus type, price, sort order
- 💺 Interactive 2×2 seat map with live availability
- 👥 Multi-passenger booking (up to 6 seats)
- 🎫 Booking confirmation with reference number
- 📋 My Bookings dashboard with trip history
- ❌ Cancel bookings with refund status

### Technical Features
- ✅ Password hashing with bcrypt
- ✅ JWT protected routes
- ✅ Double-booking prevention (atomic check)
- ✅ Input validation (express-validator)
- ✅ Global error handling
- ✅ Responsive design (mobile + desktop)
- ✅ React Context API for state management
- ✅ Axios interceptors for token injection

---

## 🛠️ Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, express-validator

**Frontend:** React 18, React Router v6, Axios, Context API, Google Fonts (Sora + DM Sans)

---

## 📦 Build for Production

```bash
# Build React frontend
npm run build

# Serve with a static server or configure Express to serve build/
```

---

## 🔧 Troubleshooting

**MongoDB connection error:**
- Ensure MongoDB is running: `sudo systemctl start mongod`
- Or use MongoDB Atlas and update `MONGO_URI`

**Port already in use:**
- Change `PORT` in `backend/.env`
- React defaults to the next available port automatically

**CORS error:**
- Ensure `FRONTEND_URL` in backend `.env` matches your React dev URL
- Default allows `http://localhost:3000`

**Seed script fails:**
- Make sure MongoDB is connected before running seed
- Check `MONGO_URI` in your `.env`
