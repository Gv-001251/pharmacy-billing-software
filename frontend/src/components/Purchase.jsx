import React from 'react'

const Purchase = () => {
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
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>12</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Pending Orders</div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>₹45,230</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>This Month Purchases</div>
        </div>
      </div>

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