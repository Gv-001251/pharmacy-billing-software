import React, { useState, useEffect } from 'react'
import Billing from './components/Billing'
import Dashboard from './components/Dashboard'
import Purchase from './components/Purchase'
import StockAlert from './components/StockAlert'
import { pharmacyAPI } from './services/api'
import './index.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [backendStatus, setBackendStatus] = useState('checking') // 'checking', 'connected', 'error'
  const [currentDate, setCurrentDate] = useState('')

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

  useEffect(() => {
    // Set current date in DD MMM YYYY format
    const today = new Date()
    const options = { day: '2-digit', month: 'short', year: 'numeric' }
    setCurrentDate(today.toLocaleDateString('en-GB', options))
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
        return <Dashboard />
    }
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'billing', label: 'New Bill', icon: '🧾' },
    { id: 'inventory', label: 'Drugs', icon: '💊' },
    { id: 'activity', label: 'Activity', icon: '📈' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'help', label: 'Help', icon: '❓' },
  ]

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">P</div>
          <div className="brand-name">Pharmax</div>
        </div>
        
        <nav>
          <ul className="nav-menu">
            {navItems.map(item => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search medicines/orders..."
            />
          </div>
          
          <div className="header-actions">
            <input
              type="date"
              className="date-picker"
              value={currentDate}
              readOnly
            />
            
            <button className="notification-btn">
              🔔
              <span className="notification-badge"></span>
            </button>
            
            <div className="user-profile">
              <div className="user-avatar">MT</div>
              <span className="user-name">Mason Taylor</span>
            </div>
            
            <div className={`connection-status ${backendStatus}`}>
              <span className="status-dot"></span>
              {backendStatus === 'connected' ? 'Connected' : 
               backendStatus === 'error' ? 'Offline' : 
               'Checking...'}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content">
          {renderActiveComponent()}
        </div>
      </main>
    </div>
  )
}

export default App