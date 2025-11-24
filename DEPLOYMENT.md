# AISHWARYA PHARMACY - Deployment Guide

## Overview
This is a full-stack pharmacy billing and management system with:
- **Frontend**: React + Vite (Port 5173)
- **Backend**: Node.js + Express + MongoDB (Port 5050)

## Project Structure

```
/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── ops.yml
│   └── package.json
│
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── server.js
│   │   └── db.js
│   ├── Dockerfile
│   ├── ops.yml
│   └── package.json
│
└── ops.yml                   # Main deployment config
```

## Frontend Features

### Billing Screen
- Customer information fields (name, phone)
- Medicine table with:
  - Medicine name (with autocomplete)
  - Batch number
  - Quantity
  - MRP
  - GST %
  - Auto-calculated amount
- Subtotal, GST, and Total calculations
- Payment mode selection (Cash/Credit)
- Save & Print Invoice button

### Other Screens
- **Dashboard**: Sales overview and analytics
- **Purchases**: Purchase order management
- **Stock Alerts**: Low stock and expiring medicines alerts

## Backend API Endpoints

### Health Check
- `GET /health` - API health status

### Billing
- `POST /api/billing` - Create new bill
- `GET /api/billing` - Get all bills (with pagination)
- `GET /api/billing/:id` - Get bill by ID
- `GET /api/billing/stats/summary` - Get sales statistics

### Inventory
- `POST /api/inventory` - Add product
- `GET /api/inventory` - Get all products
- `GET /api/inventory/:id` - Get product by ID
- `PUT /api/inventory/:id` - Update product
- `DELETE /api/inventory/:id` - Delete product
- `GET /api/inventory/alerts/stock` - Get stock alerts

### Purchase
- `POST /api/purchase` - Create purchase order
- `GET /api/purchase` - Get all purchase orders
- `GET /api/purchase/:id` - Get purchase order by ID
- `PUT /api/purchase/:id` - Update purchase order

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/pharmacy
PORT=5050
```

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on http://localhost:3000

### Backend
```bash
cd backend
npm install
npm start
```
Backend will run on http://localhost:5050

## Docker Deployment

### Build Frontend
```bash
cd frontend
docker build -t pharmacy-frontend .
docker run -p 5173:5173 pharmacy-frontend
```

### Build Backend
```bash
cd backend
docker build -t pharmacy-backend .
docker run -p 5050:5050 -e MONGODB_URI=<your-mongo-uri> pharmacy-backend
```

## CTO.ai Deployment

The project includes `ops.yml` files for deployment on CTO.ai platform.

### Backend Deployment
- Uses MongoDB Atlas (set `MONGODB_URI` in secrets)
- Port: 5050
- Health check endpoint: /health

### Frontend Deployment
- Static build served with `serve`
- Port: 5173

## Features Implemented

✅ Pharmacy header with name and phone number
✅ Navigation tabs (Billing, Purchases, Stock Alerts, Dashboard)
✅ Responsive billing form with customer details
✅ Medicine table with auto-calculations
✅ GST and payment mode handling
✅ Clean, modern UI design
✅ Backend API with MongoDB integration
✅ Dockerfiles for both frontend and backend
✅ Deployment configurations (ops.yml)

## Tech Stack

### Frontend
- React 18
- Vite 4
- Axios
- CSS (responsive design)

### Backend
- Node.js 18
- Express
- Mongoose
- MongoDB
- CORS
- Dotenv

## Contact
**AISHWARYA PHARMACY**
Phone: 9952506050
