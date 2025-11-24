# AISHWARYA PHARMACY - Billing System

A modern, responsive pharmacy billing and management system built with React and Vite.

## Features

### 💳 Billing Interface
- **Customer Information**: Name and phone number with Indian mobile validation
- **Medicine Management**: Dynamic table with autocomplete for medicine names
- **Automatic Calculations**: Real-time calculation of subtotal, GST, and total amounts
- **Payment Modes**: Support for Cash and Credit payments
- **Keyboard Navigation**: Fast data entry with keyboard shortcuts (Enter, Arrow keys)
- **Success Animations**: Visual feedback on successful bill saving

### 📊 Dashboard
- Sales overview with key metrics
- Bill creation statistics
- Low stock and expiry alerts
- Analytics placeholder for future enhancements

### 📦 Purchase Management
- Supplier order management
- Delivery tracking
- Purchase analytics
- Supplier information management

### ⚠️ Stock Alerts
- Real-time low stock notifications
- Expiry date tracking
- Critical and warning status levels
- Quick action buttons for reordering

## Technical Stack

- **Frontend**: React 18 with Vite
- **Styling**: Modern CSS with gradients and animations
- **Icons**: Emoji-based icons for universal compatibility
- **Responsive Design**: Mobile-first approach with tablet and desktop support

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

Create a production build:
```bash
npm run build
```

## Key Features Implementation

### Billing System
- **Phone Validation**: Indian mobile number format (6-9 followed by 9 digits)
- **Medicine Autocomplete**: Pre-populated with common medicines
- **Dynamic Rows**: Add/remove medicine entries dynamically
- **Real-time Calculations**: Automatic GST and total calculations
- **Form Validation**: Comprehensive input validation with user-friendly error messages

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with gradient backgrounds
- **Keyboard Navigation**: Tab, Enter, and arrow key support for rapid data entry
- **Visual Feedback**: Success animations and hover effects
- **Accessibility**: Semantic HTML5 structure with proper labeling

### Design Principles
- **Healthcare Standards**: Professional color scheme suitable for medical environments
- **Speed and Efficiency**: Optimized for pharmacy staff workflow
- **Clarity**: Clear visual hierarchy and intuitive navigation
- **Error Prevention**: Input validation and confirmation dialogs

## Future Enhancements

- Backend API integration for real-time inventory
- Barcode scanning support
- Advanced reporting and analytics
- Multi-user support with role-based access
- GST compliance reporting
- Digital invoice generation and emailing
- SMS/Email notifications for low stock and expiry alerts

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

© 2024 AISHWARYA PHARMACY. All rights reserved.