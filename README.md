# AISHWARYA PHARMACY - Complete Management System

A full-stack pharmacy billing and management system with React frontend and Node.js backend, featuring real-time inventory tracking, billing, and purchase management.

## 🏥 System Overview

This is a complete MERN (MongoDB, Express, React, Node.js) application for pharmacy management with:
- **Frontend**: React 18 with Vite on port 3000
- **Backend**: Express.js API on port 5050
- **Database**: MongoDB running in Docker on port 27017
- **Real-time Features**: Live connection status, auto-refreshing data

## Features

### 💳 Billing System
- **Customer Management**: Name and phone validation (Indian mobile format)
- **Medicine Entry**: Dynamic table with autocomplete functionality
- **Real-time Calculations**: Automatic GST, subtotal, and total calculations
- **Payment Processing**: Cash, Credit, UPI, and Card payment modes
- **Bill Generation**: Unique bill numbers with timestamps
- **Database Storage**: All bills saved to MongoDB with full audit trail

### 📊 Dashboard (Real-time)
- **Today's Sales**: Live calculation from actual billing data
- **Bill Statistics**: Total bills created with time-based filtering
- **Low Stock Alerts**: Real-time count from inventory database
- **Expiry Tracking**: Items expiring within 60 days
- **Auto-refresh**: Data updates every 30 seconds

### 📦 Inventory Management
- **Product Catalog**: Complete product information with batch tracking
- **Stock Levels**: Real-time quantity tracking with minimum stock alerts
- **GST Management**: Per-product GST rate configuration
- **Expiry Monitoring**: Automated expiry date tracking
- **Search & Filter**: Full-text search across product names and batches
- **Low Stock API**: Dedicated endpoint for critical stock items

### 🛒 Purchase Management
- **Supplier Orders**: Complete purchase order lifecycle management
- **Invoice Tracking**: Supplier invoice number and order management
- **Status Management**: Pending, Received, and Cancelled order tracking
- **Monthly Analytics**: Real-time purchase calculations by month
- **Item Management**: Multi-item orders with cost price tracking

### ⚠️ Stock Alerts (Real-time)
- **Critical Alerts**: Items below minimum stock levels
- **Expiry Warnings**: Items expiring in 60, 30, and 15-day windows
- **Visual Indicators**: Color-coded alert system
- **Quick Actions**: Order buttons for rapid reordering
- **Auto-refresh**: Stock levels update every 5 minutes

## Technical Architecture

### Backend (Node.js + Express)
- **RESTful APIs**: Complete CRUD operations for all entities
- **Database Models**: Mongoose schemas for Bills, Products, PurchaseOrders
- **Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **CORS Enabled**: Cross-origin requests properly configured
- **Health Checks**: `/health` endpoint for monitoring

### Frontend (React + Vite)
- **Component Architecture**: Modular, reusable React components
- **State Management**: React hooks for local state and side effects
- **API Integration**: Axios-based HTTP client with interceptors
- **Error Boundaries**: React error boundaries for graceful error handling
- **Real-time Updates**: Auto-refreshing components with intervals
- **Responsive Design**: Mobile-first CSS with modern layouts

### Database (MongoDB)
- **Document Models**: Optimized schemas for pharmacy operations
- **Indexing**: Performance indexes on frequently queried fields
- **Data Integrity**: Mongoose validation and constraints
- **Containerized**: MongoDB running in Docker for consistency

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Docker and Docker Compose
- npm or yarn

### Complete System Startup

1. **Using Automated Script (Recommended):**
   ```bash
   chmod +x startup.sh
   ./startup.sh
   ```

2. **Manual Startup:**
   ```bash
   # Start MongoDB
   docker run -d --name pharmacy-mongo -p 27017:27017 mongo:latest

   # Start Backend
   cd backend
   npm install
   npm start

   # Start Frontend (in new terminal)
   cd frontend
   npm install
   npm run dev
   ```

### Access Points
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5050
- **API Documentation**: http://localhost:5050/
- **Health Check**: http://localhost:5050/health

## 📡 API Endpoints

### Billing APIs
- `GET /api/billing` - List all bills with pagination
- `POST /api/billing` - Create new bill
- `GET /api/billing/:id` - Get specific bill
- `DELETE /api/billing/:id` - Delete bill

### Inventory APIs
- `GET /api/inventory` - List all products with search/filter
- `GET /api/inventory?lowStock=true` - Get low stock items
- `POST /api/inventory` - Add new product
- `PUT /api/inventory/:id` - Update product
- `DELETE /api/inventory/:id` - Delete product

### Purchase APIs
- `GET /api/purchase` - List all purchase orders
- `POST /api/purchase` - Create purchase order
- `GET /api/purchase/pending` - Get pending orders
- `PUT /api/purchase/:id` - Update order status
- `DELETE /api/purchase/:id` - Cancel order

## 🗄️ Database Schema

### Bill Model
```javascript
{
  billNumber: String (unique),
  customer: { name: String, phone: String },
  medicines: [{ name, batch, quantity, mrp, gst, amount }],
  totals: { subtotal, gst, total },
  paymentMode: Enum ['cash', 'credit', 'upi', 'card'],
  status: Enum ['pending', 'completed', 'cancelled'],
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String,
  batch: String,
  quantity: Number,
  mrp: Number,
  gst: Number,
  costPrice: Number,
  expiryDate: Date,
  category: Enum ['Medicine', 'Supplement', 'Medical Equipment', 'Other'],
  manufacturer: String,
  minStockLevel: Number,
  timestamps: true
}
```

### PurchaseOrder Model
```javascript
{
  supplierName: String,
  supplierInvoiceNumber: String (unique),
  orderDate: Date,
  items: [{ name, batch, quantity, costPrice, expiryDate }],
  totalAmount: Number,
  status: Enum ['pending', 'received', 'cancelled'],
  notes: String,
  timestamps: true
}
```

## 🔧 Development

### Environment Variables
- **Backend (.env)**:
  ```
  PORT=5050
  MONGODB_URI=mongodb://localhost:27017/pharmacy
  ```

- **Frontend (.env)**:
  ```
  VITE_API_URL=http://localhost:5050
  ```

### Scripts
- `./startup.sh` - Complete system startup
- `./start-services.sh` - Alternative startup script
- Backend: `npm start` (production) or `npm run dev` (development)
- Frontend: `npm run dev` (development) or `npm run build` (production)

## 🌟 Key Features

### Real-time Capabilities
- **Backend Connection Status**: Live indicator in frontend header
- **Auto-refreshing Data**: Dashboard and alerts update automatically
- **Health Monitoring**: Continuous backend health checks
- **Error Recovery**: Automatic retry mechanisms for failed requests

### User Experience
- **Keyboard Navigation**: Full keyboard support for rapid data entry
- **Input Validation**: Real-time validation with helpful error messages
- **Success Feedback**: Visual confirmations for successful operations
- **Loading States**: Proper loading indicators for all async operations
- **Error Boundaries**: Graceful error handling without page crashes

### Data Management
- **Pagination**: Efficient handling of large datasets
- **Search & Filter**: Real-time search across inventory
- **Audit Trail**: Complete timestamp tracking for all operations
- **Data Integrity**: Database constraints and validation

## 🐳 Docker Deployment

### Production Deployment
```bash
# Build and deploy with ops.yml
# Frontend serves static files with nginx/serve
# Backend runs as Node.js application
# MongoDB in container with persistent volumes
```

### Services Configuration
- **Frontend**: Port 3000, static build with serve
- **Backend**: Port 5050, Node.js with PM2/process manager
- **Database**: Port 27017, MongoDB with data persistence

## 🔍 Troubleshooting

### Common Issues
1. **Frontend Blank Page**: Check browser console, verify backend connection
2. **MongoDB Connection**: Ensure Docker container is running
3. **Port Conflicts**: Check if ports 3000, 5050, 27017 are available
4. **CORS Issues**: Verify backend CORS configuration

### Service Status Commands
```bash
# Check running services
docker ps | grep pharmacy-mongo
ps aux | grep "node src/server.js"
ps aux | grep vite

# Check logs
tail -f backend.log
tail -f frontend.log

# Restart services
./startup.sh
```

## 📈 Performance Features

- **Optimized Queries**: Database indexing for fast lookups
- **Pagination**: Efficient handling of large datasets
- **Caching**: Frontend caching for frequently accessed data
- **Lazy Loading**: Components load data as needed
- **Minimized Requests**: Batch API calls where possible

## 🛡️ Security Features

- **Input Validation**: Comprehensive server-side validation
- **CORS Configuration**: Proper cross-origin request handling
- **Error Sanitization**: Safe error message responses
- **Environment Variables**: Sensitive data in environment files
- **Docker Isolation**: Containerized database for security

## 📱 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

© 2024 AISHWARYA PHARMACY. All rights reserved.

---

**🏥 AISHWARYA PHARMACY**
*PH.no - 9952506050*