import React, { useState, useEffect } from 'react'
import { pharmacyAPI } from '../services/api'

const StockAlert = () => {
  const [lowStockItems, setLowStockItems] = useState([])
  const [expiringSoon, setExpiringSoon] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true)
        
        // Fetch low stock items
        const lowStockResponse = await pharmacyAPI.inventory.lowStock()
        setLowStockItems(lowStockResponse.data.data || [])
        
        // For expiring soon items, we'll need to fetch all inventory and filter
        const inventoryResponse = await pharmacyAPI.inventory.getAll()
        const allItems = inventoryResponse.data.data || []
        
        // Calculate items expiring in next 60 days
        const sixtyDaysFromNow = new Date()
        sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60)
        
        const expiringItems = allItems
          .filter(item => item.expiryDate)
          .filter(item => {
            const expiryDate = new Date(item.expiryDate)
            const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24))
            return daysLeft > 0 && daysLeft <= 60
          })
          .map(item => ({
            id: item._id,
            medicine: item.name,
            batch: item.batch,
            expiryDate: new Date(item.expiryDate).toISOString().split('T')[0],
            daysLeft: Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
          }))
          .sort((a, b) => a.daysLeft - b.daysLeft)
        
        setExpiringSoon(expiringItems)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching stock data:', error)
        setError('Failed to load stock alerts')
        setLoading(false)
      }
    }

    fetchStockData()
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchStockData, 300000)
    return () => clearInterval(interval)
  }, [])

  const getDaysLeftColor = (days) => {
    if (days <= 15) return '#e74c3c'
    if (days <= 30) return '#f1c40f'
    return '#00d084'
  }

  const getExpirationBadge = (days) => {
    if (days <= 15) return 'critical'
    if (days <= 30) return 'warning'
    return 'notice'
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading stock alerts...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        background: '#16213e', 
        padding: '30px', 
        borderRadius: '12px', 
        border: '1px solid #0f3460',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#e74c3c', marginBottom: '16px' }}>Error</h2>
        <p style={{ color: '#b8bcc8' }}>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px', color: '#ffffff' }}>⚠️ Stock Alerts</h2>
      
      {/* Alert Summary Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Low Stock Items</div>
            <div className="metric-icon outstock">📦</div>
          </div>
          <div className="metric-value">{lowStockItems.length}</div>
          <div className="metric-trend trend-down">
            <span>⚠️</span>
            <span>Needs Restock</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Expiring Soon</div>
            <div className="metric-icon expired">🕒</div>
          </div>
          <div className="metric-value">{expiringSoon.length}</div>
          <div className="metric-trend trend-down">
            <span>⏰</span>
            <span>Within 60 Days</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Critical Items</div>
            <div className="metric-icon outstock">🚨</div>
          </div>
          <div className="metric-value">
            {lowStockItems.filter(item => item.stock <= 10).length + expiringSoon.filter(item => item.daysLeft <= 15).length}
          </div>
          <div className="metric-trend trend-down">
            <span>🔴</span>
            <span>Immediate Action</span>
          </div>
        </div>
      </div>

      {/* Low Stock Items */}
      <div className="activity-section">
        <div className="section-header">
          <h3 className="section-title">Low Stock Items</h3>
          <div className="section-actions">
            <button className="view-all-btn">Order Now</button>
          </div>
        </div>
        
        <table className="activity-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Current Stock</th>
              <th>Min Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {lowStockItems.slice(0, 10).map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.stock}</td>
                <td>{item.minStock || 10}</td>
                <td>
                  <span className={`status-badge ${item.stock <= 10 ? 'cancelled' : 'pending'}`}>
                    {item.stock <= 10 ? 'Critical' : 'Low'}
                  </span>
                </td>
              </tr>
            ))}
            {lowStockItems.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#b8bcc8' }}>
                  No low stock items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Expiring Soon Items */}
      <div className="activity-section">
        <div className="section-header">
          <h3 className="section-title">Expiring Soon</h3>
          <div className="section-actions">
            <button className="view-all-btn">Apply Discount</button>
          </div>
        </div>
        
        <table className="activity-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Batch Number</th>
              <th>Expiry Date</th>
              <th>Days Left</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {expiringSoon.slice(0, 10).map((item, index) => (
              <tr key={index}>
                <td>{item.medicine}</td>
                <td>{item.batch}</td>
                <td>{item.expiryDate}</td>
                <td style={{ color: getDaysLeftColor(item.daysLeft) }}>
                  {item.daysLeft} days
                </td>
                <td>
                  <span className={`status-badge ${getExpirationBadge(item.daysLeft)}`}>
                    {getExpirationBadge(item.daysLeft)}
                  </span>
                </td>
              </tr>
            ))}
            {expiringSoon.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#b8bcc8' }}>
                  No items expiring soon
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="analytics-section">
        <h3 className="panel-title">Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <button className="btn btn-primary">
            📦 Create Purchase Order
          </button>
          <button className="btn btn-secondary">
            🏷️ Apply Discounts
          </button>
          <button className="btn btn-secondary">
            📊 Stock Report
          </button>
          <button className="btn btn-secondary">
            ⚙️ Alert Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default StockAlert