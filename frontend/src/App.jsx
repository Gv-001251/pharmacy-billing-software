import React, { useState } from 'react'
import Billing from './components/Billing'
import Dashboard from './components/Dashboard'
import Purchase from './components/Purchase'
import StockAlert from './components/StockAlert'
import './index.css'

function App() {
  const [activeTab, setActiveTab] = useState('billing')

  const renderActiveComponent = () => {
    switch(activeTab) {
      case 'billing':
        return <Billing />
      case 'dashboard':
        return <Dashboard />
      case 'purchase':
        return <Purchase />
      case 'stock-alert':
        return <StockAlert />
      default:
        return <Billing />
    }
  }

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="pharmacy-info">
            <div className="pharmacy-logo">
              💊
            </div>
            <div>
              <div className="pharmacy-name">AISHWARYA PHARMACY</div>
              <div className="contact-info">📞 9952506050</div>
              <div className="pharmacy-address">123 Main Street, City - 600001</div>
            </div>
          </div>
          <div className="gst-info">
            <div>GSTIN: 33AAAPL1234C1ZV</div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          💳 Billing
        </button>
        <button 
          className={`nav-tab ${activeTab === 'purchase' ? 'active' : ''}`}
          onClick={() => setActiveTab('purchase')}
        >
          📦 Purchases
        </button>
        <button 
          className={`nav-tab ${activeTab === 'stock-alert' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock-alert')}
        >
          ⚠️ Stock Alerts
        </button>
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
      </nav>

      {/* Main Content */}
      <main>
        {renderActiveComponent()}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-text">Thank you for choosing AISHWARYA PHARMACY</div>
        <div className="footer-contact">📞 9952506050</div>
      </footer>
    </div>
  )
}

export default App