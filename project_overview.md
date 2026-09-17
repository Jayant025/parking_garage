# ParkFlow — Smart Parking Garage Management System

## Project Summary
ParkFlow is a full-stack web application for managing a smart parking garage. It allows operators/admins to check vehicles in and out, manage parking spots, view dashboards with analytics, configure pricing, and generate reports. It features JWT-based authentication with role-based access.

---

## Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Styling:** TailwindCSS 3
- **Routing:** React Router DOM v6
- **State/Data:** TanStack React Query v5, React Context API
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 4
- **Database:** MongoDB Atlas (via Mongoose 8)
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** Zod
- **Security:** Helmet, CORS, express-rate-limit, cookie-parser
- **Dev Tool:** Nodemon

---

## Project Structure

```
AurigaIT/
├── backend/
│   ├── .env                    # Environment variables (PORT, MONGODB_URI, JWT_SECRET, etc.)
│   ├── package.json
│   └── src/
│       ├── server.js           # Entry point — starts Express server
│       ├── app.js              # Express app setup (middleware, routes, CORS)
│       ├── config/             # DB connection config
│       ├── models/             # Mongoose schemas
│       │   ├── User.js         # User model (name, email, password, role)
│       │   ├── Garage.js       # Garage model
│       │   ├── ParkingSpot.js  # Individual parking spot model
│       │   ├── ParkingSession.js # Check-in/check-out session model
│       │   ├── Vehicle.js      # Vehicle model
│       │   └── Pricing.js      # Pricing rules model
│       ├── controllers/        # Route handlers
│       │   ├── authController.js
│       │   ├── dashboardController.js
│       │   ├── garageController.js
│       │   ├── parkingController.js
│       │   ├── pricingController.js
│       │   ├── reportController.js
│       │   └── spotController.js
│       ├── routes/             # Express route definitions
│       │   ├── authRoutes.js       # /api/auth (login, register, logout, me)
│       │   ├── dashboardRoutes.js  # /api/dashboard
│       │   ├── garageRoutes.js     # /api/garage
│       │   ├── parkingRoutes.js    # /api/parking (check-in, check-out)
│       │   ├── pricingRoutes.js    # /api/pricing
│       │   ├── reportRoutes.js     # /api/reports
│       │   ├── spotRoutes.js       # /api/spots
│       │   └── vehicleRoutes.js    # /api/vehicles
│       ├── middleware/         # Auth middleware (JWT verification)
│       ├── services/           # Business logic services
│       ├── scripts/            # Seed scripts (npm run seed)
│       └── utils/              # Utility helpers
│
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── package.json
│   └── src/
│       ├── main.tsx            # React entry point
│       ├── App.tsx             # Root component (providers: QueryClient, Theme, Auth, Router)
│       ├── index.css           # Global styles
│       ├── context/
│       │   ├── AuthContext.tsx  # Auth state (login, register, logout, session restore)
│       │   └── ThemeContext.tsx # Dark/light theme toggle
│       ├── components/
│       │   ├── auth/
│       │   │   └── ProtectedRoute.tsx  # Route guard (redirects to /login if unauthenticated)
│       │   └── ui/             # Reusable UI components (LoadingSkeleton, etc.)
│       ├── pages/
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── ForgotPasswordPage.tsx
│       │   ├── ResetPasswordPage.tsx
│       │   ├── DashboardPage.tsx       # Main analytics dashboard
│       │   ├── CheckInPage.tsx         # Vehicle check-in flow
│       │   ├── CheckOutPage.tsx        # Vehicle check-out flow
│       │   ├── SpotsPage.tsx           # Parking spot management
│       │   ├── GaragePage.tsx          # Garage info/configuration
│       │   ├── HistoryPage.tsx         # Parking session history
│       │   ├── SearchPage.tsx          # Search vehicles/sessions
│       │   ├── PricingPage.tsx         # Pricing rule management
│       │   ├── ReportsPage.tsx         # Reports and analytics
│       │   ├── ProfilePage.tsx         # User profile
│       │   └── SettingsPage.tsx        # App settings
│       ├── routes/
│       │   └── AppRoutes.tsx   # Route definitions with protected routes
│       ├── hooks/              # Custom React hooks
│       ├── services/
│       │   ├── apiClient.ts    # Axios instance with JWT interceptor
│       │   ├── parkingService.ts # API service functions for parking operations
│       │   └── mockData.ts     # Mock/seed data for development
│       ├── types/
│       │   └── index.ts        # TypeScript interfaces (User, ParkingSpot, Session, etc.)
│       └── layouts/            # Layout components (sidebar, header, etc.)
```

---

## Key Features
1. **Authentication** — JWT-based login/register with session restore on page reload; tokens stored in localStorage
2. **Protected Routes** — Unauthenticated users are redirected to `/login`
3. **Dashboard** — Analytics overview with charts (Recharts)
4. **Check-In / Check-Out** — Full vehicle parking session lifecycle
5. **Parking Spot Management** — CRUD for individual spots in the garage
6. **Pricing Management** — Configurable pricing rules
7. **History & Search** — Browse and search past parking sessions
8. **Reports** — Generate parking/revenue reports
9. **Theme Toggle** — Dark/light mode via React Context
10. **Seed Script** — `npm run seed` to populate the database with sample data

---

## How to Run

```bash
# Backend (port 5004)
cd backend
npm install
npm run dev

# Frontend (port 5173)
cd frontend
npm install
npm run dev
```

---

## Environment Variables (Backend `.env`)
| Variable       | Value                              |
|----------------|-------------------------------------|
| `PORT`         | 5004                               |
| `NODE_ENV`     | development                        |
| `MONGODB_URI`  | MongoDB Atlas connection string    |
| `JWT_SECRET`   | Random 64-char hex string          |
| `CLIENT_URL`   | http://localhost:5173              |

---

## API Endpoints (Base: `http://localhost:5004/api`)
| Route            | Purpose                        |
|------------------|-------------------------------|
| `/auth`          | Login, Register, Logout, Me   |
| `/dashboard`     | Dashboard analytics data      |
| `/garage`        | Garage CRUD                   |
| `/spots`         | Parking spot CRUD             |
| `/parking`       | Check-in / Check-out          |
| `/pricing`       | Pricing rules CRUD            |
| `/reports`       | Report generation             |
| `/vehicles`      | Vehicle lookup                |
