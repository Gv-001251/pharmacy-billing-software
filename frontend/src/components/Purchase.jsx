import React, { useState, useEffect } from 'react'
import { pharmacyAPI } from '../services/api'

const Purchase = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [stats, setStats] = useState({
    pendingOrders: 0,
    thisMonthPurchases: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        setLoading(true)
        
        // Fetch all purchase orders
        const response = await pharmacyAPI.purchase.getAll()
        const orders = response.data.data || []
        setPurchaseOrders(orders)
        
        // Calculate stats
        const pendingOrders = orders.filter(order => order.status === 'pending').length
        
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const thisMonthPurchases = orders
          .filter(order => {
            const orderDate = new Date(order.createdAt)
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
          })
          .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        
        setStats({
          pendingOrders,
          thisMonthPurchases
        })
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching purchase data:', error)
        setError('Failed to load purchase data')
        setLoading(false)
      }
    }

    fetchPurchaseData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchPurchaseData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading purchase data...
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
      <h2 style={{ marginBottom: '24px', color: '#ffffff' }}>📦 Purchase Management</h2>
      
      {/* Stats Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Pending Orders</div>
            <div className="metric-icon outstock">📋</div>
          </div>
          <div className="metric-value">{stats.pendingOrders}</div>
          <div className="metric-trend trend-up">
            <span>📊</span>
            <span>Awaiting Approval</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">This Month Purchases</div>
            <div className="metric-icon sales">💰</div>
          </div>
          <div className="metric-value">₹{stats.thisMonthPurchases.toLocaleString()}</div>
          <div className="metric-trend trend-up">
            <span>↑</span>
            <span>+12%</span>
          </div>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="activity-section">
        <div className="section-header">
          <h3 className="section-title">Recent Purchase Orders</h3>
          <div className="section-actions">
            <button className="view-all-btn">Create New Order</button>
          </div>
        </div>
        
        <table className="activity-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.slice(0, 10).map((order, index) => (
              <tr key={index}>
                <td className="order-id">#{order.orderId || `PO${1000 + index}`}</td>
                <td>{order.supplierName || 'Medical Supplier'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                <td>₹{(order.totalAmount || 0).toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${order.status || 'pending'}`}>
                    {order.status || 'pending'}
                  </span>
                </td>
              </tr>
            ))}
            {purchaseOrders.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#b8bcc8' }}>
                  No purchase orders found
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
            ➕ New Purchase Order
          </button>
          <button className="btn btn-secondary">
            📊 Inventory Report
          </button>
          <button className="btn btn-secondary">
            📋 Supplier List
          </button>
          <button className="btn btn-secondary">
            📈 Purchase Analytics
          </button>
        </div>
      </div>
    </div>
  )
}

export default Purchase