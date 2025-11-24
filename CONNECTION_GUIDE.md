# 🏥 AISHWARYA PHARMACY - Setup & Connection Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Docker (for MongoDB)
- Git

### One-Command Startup
```bash
./startup.sh
```

### Manual Startup

#### 1. Start MongoDB
```bash
docker run -d --name pharmacy-mongo -p 27017:27017 mongo:latest
```

#### 2. Start Backend
```bash
cd backend
npm install
npm start
```

#### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📍 Access URLs
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5050
- **Health Check**: http://localhost:5050/health
- **API Documentation**: http://localhost:5050/

## 🔧 Troubleshooting

### Frontend Shows Blank Page

1. **Check Browser Console**
   - Open browser (F12)
   - Go to Console tab
   - Look for JavaScript errors

2. **Check Backend Connection**
   - Open http://localhost:5050/health in browser
   - Should return: `{"status":"OK","message":"Pharmacy API is running"...}`

3. **Check Services Status**
   ```bash
   # Check if MongoDB is running
   docker ps | grep pharmacy-mongo
   
   # Check if backend is running
   curl http://localhost:5050/health
   
   # Check if frontend is running
   curl http://localhost:3000
   ```

4. **Check Logs**
   ```bash
   # Backend logs
   tail -f backend.log
   
   # Frontend logs
   tail -f frontend.log
   ```

### Common Issues

#### Backend Not Starting
- **Problem**: MongoDB connection refused
- **Solution**: Make sure MongoDB container is running
  ```bash
  docker start pharmacy-mongo
  ```

#### Frontend Not Loading
- **Problem**: Port 3000 already in use
- **Solution**: Kill existing process
  ```bash
  pkill -f "vite"
  ```

#### API Calls Failing
- **Problem**: CORS or connection errors
- **Solution**: Check if backend is running on port 5050

## 🛠️ Development

### Environment Variables

#### Backend (.env)
```
PORT=5050
MONGODB_URI=mongodb://localhost:27017/pharmacy
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:5050
```

### API Endpoints

#### Billing
- `POST /api/billing` - Create new bill
- `GET /api/billing` - Get all bills
- `GET /api/billing/:id` - Get bill by ID
- `DELETE /api/billing/:id` - Delete bill

#### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add new item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item
- `GET /api/inventory/low-stock` - Get low stock items

#### Purchase
- `GET /api/purchase` - Get all purchase orders
- `POST /api/purchase` - Create new purchase order
- `GET /api/purchase/pending` - Get pending orders

## 🎯 Features

### 💳 Billing
- Customer information management
- Medicine billing with GST calculation
- Multiple payment modes
- Print invoices

### 📦 Purchase Management
- Supplier order management
- Purchase order tracking
- Inventory updates

### ⚠️ Stock Alerts
- Low stock notifications
- Expiry date tracking
- Automatic alerts

### 📊 Dashboard
- Sales overview
- Inventory status
- Analytics and reports

## 🔄 Reset Everything

To completely reset the application:

```bash
# Stop all services
pkill -f "vite"
pkill -f "node src/server.js"
docker stop pharmacy-mongo
docker rm pharmacy-mongo

# Remove logs
rm -f backend.log frontend.log

# Restart
./startup.sh
```

## 🆘 Getting Help

If you're still experiencing issues:

1. Check the browser console for JavaScript errors
2. Verify all services are running using the status commands above
3. Check the log files for detailed error messages
4. Make sure no other applications are using ports 3000 or 5050

## 📞 Contact

For technical support, check the console logs and error messages first. Most issues are related to:
- MongoDB not running
- Backend not started
- Port conflicts
- Network connectivity issues

The application includes real-time connection status indicators in the header to help diagnose connectivity issues.