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

  const getStatusColor = (status) => {
    return status === 'critical' ? '#e74c3c' : '#f39c12'
  }

  const getDaysLeftColor = (days) => {
    if (days <= 15) return '#e74c3c'
    if (days <= 30) return '#f39c12'
    return '#27ae60'
  }

  if (loading) {
    return (
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2>Loading stock alerts...</h2>
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
      <h2 style={{ marginBottom: '25px', color: '#333' }}>⚠️ Stock Alerts</h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>{lowStockItems.length}</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Low Stock Items</div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>{expiringSoon.length}</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Expiring Soon</div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#e74c3c' }}>🔴 Low Stock Items</h3>
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#e9ecef' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Medicine Name</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Current Stock</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Min Stock</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                    ✅ No low stock items found
                  </td>
                </tr>
              ) : (
                lowStockItems.map(item => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '15px', fontWeight: '500' }}>{item.name}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{ 
                        color: item.quantity < item.minStockLevel / 2 ? '#e74c3c' : '#f39c12',
                        fontWeight: 'bold'
                      }}>
                        {item.quantity}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>{item.minStockLevel}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{
                        background: item.quantity < item.minStockLevel / 2 ? '#e74c3c' : '#f39c12',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {item.quantity < item.minStockLevel / 2 ? 'CRITICAL' : 'WARNING'}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button style={{
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
                        Order Now
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expiring Soon */}
      <div>
        <h3 style={{ marginBottom: '15px', color: '#f39c12' }}>🟡 Expiring Soon</h3>
        <div style={{
          background: '#fef9e7',
          border: '2px solid #f39c12',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left' }}>Medicine Name</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Batch</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Expiry Date</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Days Left</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {expiringSoon.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                    ✅ No items expiring in the next 60 days
                  </td>
                </tr>
              ) : (
                expiringSoon.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #fdeaa8' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{item.medicine}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{item.batch}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{item.expiryDate}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        color: getDaysLeftColor(item.daysLeft),
                        fontWeight: 'bold'
                      }}>
                        {item.daysLeft} days
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button style={{
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
                        Return/Sell
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{
        background: '#d1ecf1',
        border: '2px solid #bee5eb',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '30px',
        textAlign: 'center'
      }}>
        <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>💡 Alert Settings</h4>
        <p style={{ color: '#0c5460', fontSize: '14px' }}>
          Configure custom alert thresholds for stock levels and expiry dates. 
          Get notified via email or SMS when items need attention.
        </p>
      </div>
    </div>
  )
}

export default StockAlert