import React, { useState, useEffect } from 'react'
import { pharmacyAPI } from '../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    todaySales: 0,
    billsCreated: 0,
    lowStockItems: 0,
    expiringSoon: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        
        setStats({
          todaySales,
          billsCreated: bills.length,
          lowStockItems: lowStockItems.length,
          expiringSoon: expiringItems.length
        })
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
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2>Loading dashboard...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2>Error</h2>
        <p>{error}</p>
        <p>Please check if the backend is running.</p>
      </div>
    )
  }

  return (
    <div style={{ 
      background: 'white', 
      padding: '30px', 
      borderRadius: '16px', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '25px', color: '#333' }}>📊 Dashboard</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>₹{stats.todaySales.toLocaleString()}</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Today's Sales</div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>{stats.billsCreated}</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Bills Created</div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>{stats.lowStockItems}</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Low Stock Items</div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>{stats.expiringSoon}</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Expiring Soon</div>
        </div>
      </div>

      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#666'
      }}>
        <h3 style={{ marginBottom: '15px' }}>📈 Analytics Dashboard</h3>
        <p>Detailed analytics and reports will be available here.</p>
        <p style={{ marginTop: '10px', fontSize: '14px' }}>Features: Sales trends, inventory reports, customer insights, and more.</p>
      </div>
    </div>
  )
}

export default Dashboard