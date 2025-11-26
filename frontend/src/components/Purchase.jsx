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
          .reduce((sum, order) => sum + order.totalAmount, 0)
        
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
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2>Loading purchase data...</h2>
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
      <h2 style={{ marginBottom: '25px', color: '#333' }}>📦 Purchase Management</h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>{stats.pendingOrders}</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Pending Orders</div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>₹{stats.thisMonthPurchases.toLocaleString()}</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>This Month Purchases</div>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>📋 Recent Purchase Orders</h3>
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#e9ecef' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Supplier</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Invoice #</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Items</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Total Amount</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                    📦 No purchase orders found
                  </td>
                </tr>
              ) : (
                purchaseOrders.slice(0, 10).map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '15px', fontWeight: '500' }}>{order.supplierName}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>{order.supplierInvoiceNumber}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>{order.items.length}</td>
                    <td style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>
                      ₹{order.totalAmount.toLocaleString()}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{
                        background: order.status === 'pending' ? '#f39c12' : 
                                     order.status === 'received' ? '#27ae60' : '#e74c3c',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
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
        textAlign: 'center'
      }}>
        <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>💡 Purchase Management</h4>
        <p style={{ color: '#0c5460', margin: 0 }}>
          Track supplier orders, manage inventory levels, and maintain optimal stock.
        </p>
      </div>
    </div>
  )
}

export default Purchase