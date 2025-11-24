import React, { useState, useEffect } from 'react'
import Billing from './components/Billing'
import Dashboard from './components/Dashboard'
import Purchase from './components/Purchase'
import StockAlert from './components/StockAlert'
import { pharmacyAPI } from './services/api'
import './index.css'

function App() {
  const [activeTab, setActiveTab] = useState('billing')
  const [backendStatus, setBackendStatus] = useState('checking') // 'checking', 'connected', 'error'

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await pharmacyAPI.healthCheck()
        if (response.status === 200) {
          setBackendStatus('connected')
          console.log('✅ Backend connected successfully')
        }
      } catch (error) {
        setBackendStatus('error')
        console.error('❌ Backend connection failed:', error.message)
      }
    }

    checkBackendConnection()
    
    // Check connection every 30 seconds
    const interval = setInterval(checkBackendConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

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
              <div className="contact-info">PH.no - 9952506050</div>
              <div className="pharmacy-address">123 Main Street, City - 600001</div>
            </div>
          </div>
          <div className="gst-info">
            <div>GSTIN: 33AAAPL1234C1ZV</div>
            <div style={{ 
              marginTop: '10px', 
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: backendStatus === 'connected' ? 'rgba(39, 174, 96, 0.2)' : 
                              backendStatus === 'error' ? 'rgba(231, 76, 60, 0.2)' : 
                              'rgba(241, 196, 15, 0.2)',
              color: backendStatus === 'connected' ? '#27ae60' : 
                     backendStatus === 'error' ? '#e74c3c' : 
                     '#f1c40f'
            }}>
              {backendStatus === 'connected' ? '🟢 Backend Connected' : 
               backendStatus === 'error' ? '🔴 Backend Offline' : 
               '🟡 Checking Backend...'}
            </div>
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
        <div className="footer-contact">PH.no - 9952506050</div>
      </footer>
    </div>
  )
}

export default App