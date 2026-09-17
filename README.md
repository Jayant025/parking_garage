# ParkFlow — Smart Parking Garage Management System

A production-grade, full-stack web application for managing smart parking garage facilities, vehicle check-ins/check-outs, parking spot telemetry, hourly pricing schedules in Indian Rupees (₹), and customer support ticketing.

---

## 🌟 Key Features

### 🚗 Customer Portal (`/customer`)
- **Live Vacant Parking Spots**: Real-time display of available spots fetched directly from MongoDB Atlas. View spot number, level, spot type (Compact, Standard, EV), and EV charger availability with kW power rating.
- **Parking Fee Schedule (INR / ₹)**: Public schedule of rates formatted in Indian Rupees for Compact, Standard, and EV bays.
- **Customer Support System**: Submit support tickets with subject, category, and message details. Track support ticket status (`OPEN`, `IN_PROGRESS`, `RESOLVED`).
- **Customer Profile**: View member badge number and account details.

### 🏢 Operator Management Hub (`/dashboard`)
- **Operator Dashboard**: Operational overview with real-time occupancy metrics, floor distribution, turnover telemetry, and net revenue streams in ₹.
- **Vehicle Check-In**: Automated/manual check-in workflow with spot allocation.
- **Vehicle Check-Out & Billing**: Session lookup, duration calculation, municipal tax computation, payment method selection (Cash, Card, App, Pass), and receipt generation.
- **Parking Spot Map**: Visual grid matrix of all garage levels and spot statuses.
- **Rate Tier & Pricing Configuration**: Admin configuration for hourly rates and daily maximum caps in ₹.
- **Reports & Analytics**: Visual charts for revenue trends, spot type distribution, and peak occupancy times using Recharts.
- **Customer Support Management (`/support`)**: Search, filter, inspect, and resolve customer support tickets.

### 🔐 Security & Auth
- **Role-Based Access Control**: Strict backend API protection returning `403 Forbidden` for non-operator access to administrative endpoints.
- **Dual Login UX**: "Login as Operator" and "Login as Customer" tabs with server-enforced role routing.
- **Customer Registration Guard**: User registrations strictly assign `CUSTOMER` roles, ignoring client-side role manipulation.
- **Forgot & Reset Password**: 15-minute expiring single-use reset tokens with bcrypt password hashing.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite 5, TailwindCSS, React Router DOM v6, TanStack Query v5, Recharts, Lucide Icons.
- **Backend**: Node.js, Express 4, MongoDB Atlas, Mongoose 8, JWT, bcryptjs, Helmet, CORS, Rate Limiter.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Create `backend/.env`:
```env
PORT=5004
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database (Optional)
```bash
cd backend
npm run seed
```

### 4. Run Development Servers
```bash
# Start Backend API (Port 5004)
cd backend
npm run dev

# Start Frontend (Port 5173)
cd frontend
npm run dev
```

---

## 🔑 Default Accounts (Post-Seed)
- **Operator Account**: `admin@parkflow.io` / `password123`
- **Customer Account**: `customer@parkflow.io` / `password123`
