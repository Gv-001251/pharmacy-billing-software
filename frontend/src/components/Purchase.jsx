import React, { useState, useEffect } from 'react'
import { pharmacyAPI } from '../services/api'

const Purchase = () => {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    monthlyPurchases: 0
  })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        setLoading(true)
        
        // Fetch purchase orders
        const ordersResponse = await pharmacyAPI.purchase.getAll()
        const purchaseOrders = ordersResponse.data.data || []
        
        setOrders(purchaseOrders)
        
        // Calculate stats
        const currentMonth = new Date()
        currentMonth.setDate(1)
        currentMonth.setHours(0, 0, 0, 0)
        
        const thisMonthOrders = purchaseOrders.filter(order => {
          const orderDate = new Date(order.createdAt)
          return orderDate >= currentMonth
        })
        
        const monthlyTotal = thisMonthOrders.reduce((sum, order) => {
          return sum + (order.totalAmount || 0)
        }, 0)
        
        const pendingCount = purchaseOrders.filter(order => 
          order.status === 'pending' || order.status === 'ordered'
        ).length
        
        setStats({
          pendingOrders: pendingCount,
          monthlyPurchases: monthlyTotal
        })
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching purchase data:', error)
        setError('Failed to load purchase data')
        setLoading(false)
      }
    }

    fetchPurchaseData()
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
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>₹{stats.monthlyPurchases.toLocaleString()}</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>This Month Purchases</div>
        </div>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div style={{
          background: '#f8f9fa',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>📋 Recent Purchase Orders</h3>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#e9ecef' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Order ID</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Supplier</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Amount</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '15px', fontWeight: '500' }}>
                      {order.orderNumber || `PO-${order._id.slice(-6)}`}
                    </td>
                    <td style={{ padding: '15px' }}>{order.supplierName || 'N/A'}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      ₹{(order.totalAmount || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{
                        background: order.status === 'completed' ? '#27ae60' : 
                                      order.status === 'pending' ? '#f39c12' : '#667eea',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {(order.status || 'pending').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{
        background: '#f8f9fa',
        padding: '30px',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#666'
      }}>
        <h3 style={{ marginBottom: '15px' }}>🛒 Purchase Order System</h3>
        <p style={{ marginBottom: '20px' }}>Manage supplier orders, track deliveries, and maintain inventory levels.</p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginTop: '25px'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #e9ecef'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>📋</div>
            <strong>New Purchase Order</strong>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Create orders from suppliers</p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #e9ecef'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🚚</div>
            <strong>Track Deliveries</strong>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Monitor order status</p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #e9ecef'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>👥</div>
            <strong>Supplier Management</strong>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Manage supplier information</p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #e9ecef'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
            <strong>Purchase Reports</strong>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>View purchase analytics</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Purchase