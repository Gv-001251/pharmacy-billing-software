import React, { useState, useEffect } from 'react'
import { pharmacyAPI } from '../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    todaySales: 0,
    billsCreated: 0,
    lowStockItems: 0,
    expiringSoon: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chartType, setChartType] = useState('sales')
  const [period, setPeriod] = useState('30D')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch real data from backend
        const [billsResponse, inventoryResponse] = await Promise.all([
          pharmacyAPI.billing.getAll(),
          pharmacyAPI.inventory.lowStock()
        ])
        
        const bills = billsResponse.data.data || []
        const lowStockItems = inventoryResponse.data.data || []
        
        // Calculate today's sales
        const today = new Date().toDateString()
        const todayBills = bills.filter(bill => 
          new Date(bill.createdAt).toDateString() === today
        )
        const todaySales = todayBills.reduce((sum, bill) => sum + bill.totals.total, 0)
        
        // Calculate expiring soon items
        const inventoryResponse2 = await pharmacyAPI.inventory.getAll()
        const allItems = inventoryResponse2.data.data || []
        const sixtyDaysFromNow = new Date()
        sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60)
        
        const expiringItems = allItems
          .filter(item => item.expiryDate)
          .filter(item => {
            const expiryDate = new Date(item.expiryDate)
            const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24))
            return daysLeft > 0 && daysLeft <= 60
          })
        
        // Generate recent activity data
        const activity = bills.slice(0, 10).map((bill, index) => ({
          id: `#${1234 + index}`,
          customerName: bill.customerName || `Customer ${index + 1}`,
          customerPhone: bill.customerPhone || '9876543210',
          time: new Date(bill.createdAt).toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          amount: bill.totals.total || 0,
          status: Math.random() > 0.3 ? 'delivered' : Math.random() > 0.5 ? 'pending' : 'cancelled'
        }))
        
        setStats({
          todaySales,
          billsCreated: bills.length,
          lowStockItems: lowStockItems.length,
          expiringSoon: expiringItems.length
        })
        
        setRecentActivity(activity)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Failed to load dashboard data')
        setLoading(false)
      }
    }

    fetchDashboardData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading dashboard...
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
        <p style={{ color: '#b8bcc8', marginTop: '8px' }}>Please check if the backend is running.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Total Profit</div>
            <div className="metric-icon profit">₹</div>
          </div>
          <div className="metric-value">₹{(stats.todaySales * 0.22).toLocaleString()}</div>
          <div className="metric-trend trend-up">
            <span>↑</span>
            <span>+17%</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Total Sales</div>
            <div className="metric-icon sales">💰</div>
          </div>
          <div className="metric-value">₹{stats.todaySales.toLocaleString()}</div>
          <div className="metric-trend trend-up">
            <span>↑</span>
            <span>+17%</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Out of Stock</div>
            <div className="metric-icon outstock">⚠️</div>
          </div>
          <div className="metric-value">{stats.lowStockItems}</div>
          <div className="metric-trend trend-down">
            <span>↑</span>
            <span>+5%</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Expired</div>
            <div className="metric-icon expired">🕒</div>
          </div>
          <div className="metric-value">{stats.expiringSoon}</div>
          <div className="metric-trend trend-down">
            <span>↓</span>
            <span>-2%</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="activity-section">
        <div className="section-header">
          <h3 className="section-title">Recent Activity</h3>
          <div className="section-actions">
            <button className="view-all-btn">View All</button>
          </div>
        </div>
        
        <table className="activity-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Order ID</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((activity, index) => (
              <tr key={index}>
                <td>
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {activity.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="customer-details">
                      <div className="customer-name">{activity.customerName}</div>
                      <div className="customer-phone">{activity.customerPhone}</div>
                    </div>
                  </div>
                </td>
                <td className="order-id">{activity.id}</td>
                <td>{activity.time}</td>
                <td>₹{activity.amount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${activity.status}`}>
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analytics Chart */}
      <div className="analytics-section">
        <div className="chart-controls">
          <h3 className="chart-title">Sales Analytics</h3>
          <div className="chart-options">
            <div className="chart-toggle">
              <button 
                className={`toggle-btn ${chartType === 'sales' ? 'active' : ''}`}
                onClick={() => setChartType('sales')}
              >
                Total Sell
              </button>
              <button 
                className={`toggle-btn ${chartType === 'drugs' ? 'active' : ''}`}
                onClick={() => setChartType('drugs')}
              >
                Drugs
              </button>
            </div>
            
            <div className="period-selector">
              <button 
                className={`period-btn ${period === '7D' ? 'active' : ''}`}
                onClick={() => setPeriod('7D')}
              >
                7D
              </button>
              <button 
                className={`period-btn ${period === '30D' ? 'active' : ''}`}
                onClick={() => setPeriod('30D')}
              >
                30D
              </button>
              <button 
                className={`period-btn ${period === 'All' ? 'active' : ''}`}
                onClick={() => setPeriod('All')}
              >
                All
              </button>
            </div>
          </div>
        </div>
        
        <div className="chart-container">
          📊 Interactive sales chart will be displayed here
          <br />
          <small>Showing {chartType} data for {period} period</small>
        </div>
      </div>
    </div>
  )
}

export default Dashboard