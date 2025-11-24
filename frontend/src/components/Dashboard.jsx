import React from 'react'

const Dashboard = () => {
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
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>₹12,450</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Today's Sales</div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>24</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Bills Created</div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>8</div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Low Stock Items</div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>3</div>
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