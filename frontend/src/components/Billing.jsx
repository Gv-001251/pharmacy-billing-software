import React, { useState, useEffect, useRef } from 'react'
import { pharmacyAPI } from '../services/api'

const Billing = () => {
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [paymentMode, setPaymentMode] = useState('cash')
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: '',
      batch: '',
      quantity: 1,
      mrp: 0,
      gst: 0,
      amount: 0,
      stock: 50
    }
  ])
  const [showSuccess, setShowSuccess] = useState(false)

  // Auto-complete functionality
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currentEditingId, setCurrentEditingId] = useState(null)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [suggestionsError, setSuggestionsError] = useState('')
  const searchTimeoutRef = useRef(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Validate Indian mobile number
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  const handlePhoneChange = (value) => {
    setCustomerPhone(value)
    if (value && !validatePhone(value)) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number')
    } else {
      setPhoneError('')
    }
  }

  const handleMedicineChange = (id, field, value) => {
    const updatedMedicines = medicines.map(med => {
      if (med.id === id) {
        const updatedMed = { ...med, [field]: value }
        
        // Calculate amount when quantity, mrp, or gst changes
        if (field === 'quantity' || field === 'mrp' || field === 'gst') {
          const qty = parseFloat(updatedMed.quantity) || 0
          const price = parseFloat(updatedMed.mrp) || 0
          const gstPercent = parseFloat(updatedMed.gst) || 0
          const baseAmount = qty * price
          const gstAmount = baseAmount * (gstPercent / 100)
          updatedMed.amount = baseAmount + gstAmount
        }
        
        return updatedMed
      }
      return med
    })
    setMedicines(updatedMedicines)
  }

  // Fetch medicine suggestions from backend
  const fetchMedicineSuggestions = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setFilteredSuggestions([])
      return
    }

    setLoadingSuggestions(true)
    setSuggestionsError('')
    
    try {
      const response = await pharmacyAPI.inventory.search(searchTerm)
      if (response.data.success) {
        setFilteredSuggestions(response.data.data)
      } else {
        setSuggestionsError('Failed to fetch suggestions')
        setFilteredSuggestions([])
      }
    } catch (error) {
      console.error('Error fetching medicine suggestions:', error)
      setSuggestionsError('Error loading suggestions')
      setFilteredSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const handleMedicineNameChange = (id, value) => {
    handleMedicineChange(id, 'name', value)
    
    // Handle autocomplete with debouncing
    setCurrentEditingId(id)
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    if (value.length > 0) {
      setShowSuggestions(true)
      
      // Set a timeout to debounce the API call
      searchTimeoutRef.current = setTimeout(() => {
        fetchMedicineSuggestions(value)
      }, 300)
    } else {
      setShowSuggestions(false)
      setFilteredSuggestions([])
    }
  }

  const selectSuggestion = (medicine) => {
    handleMedicineChange(currentEditingId, 'name', medicine.name)
    handleMedicineChange(currentEditingId, 'batch', medicine.batch || '')
    handleMedicineChange(currentEditingId, 'mrp', medicine.mrp || 0)
    handleMedicineChange(currentEditingId, 'gst', medicine.gst || 0)
    handleMedicineChange(currentEditingId, 'stock', medicine.stock || 50)
    setShowSuggestions(false)
    setCurrentEditingId(null)
    setFilteredSuggestions([])
    
    // Recalculate amount with new values
    const updatedMedicines = medicines.map(med => {
      if (med.id === currentEditingId) {
        const qty = parseFloat(med.quantity) || 1
        const price = parseFloat(medicine.mrp) || 0
        const gstPercent = parseFloat(medicine.gst) || 0
        const baseAmount = qty * price
        const gstAmount = baseAmount * (gstPercent / 100)
        return { ...med, name: medicine.name, batch: medicine.batch || '', mrp: medicine.mrp || 0, gst: medicine.gst || 0, stock: medicine.stock || 50, amount: baseAmount + gstAmount }
      }
      return med
    })
    setMedicines(updatedMedicines)
  }

  const addMedicineRow = () => {
    const newMedicine = {
      id: Date.now(),
      name: '',
      batch: '',
      quantity: 1,
      mrp: 0,
      gst: 0,
      amount: 0,
      stock: 50
    }
    setMedicines([...medicines, newMedicine])
  }

  const removeMedicineRow = (id) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter(med => med.id !== id))
    }
  }

  const updateQuantity = (id, delta) => {
    const updatedMedicines = medicines.map(med => {
      if (med.id === id) {
        const newQty = Math.max(1, (parseFloat(med.quantity) || 0) + delta)
        const updatedMed = { ...med, quantity: newQty }
        
        // Recalculate amount
        const price = parseFloat(updatedMed.mrp) || 0
        const gstPercent = parseFloat(updatedMed.gst) || 0
        const baseAmount = newQty * price
        const gstAmount = baseAmount * (gstPercent / 100)
        updatedMed.amount = baseAmount + gstAmount
        
        return updatedMed
      }
      return med
    })
    setMedicines(updatedMedicines)
  }

  // Calculate totals
  const calculateSubtotal = () => {
    return medicines.reduce((total, med) => {
      const qty = parseFloat(med.quantity) || 0
      const mrp = parseFloat(med.mrp) || 0
      return total + (qty * mrp)
    }, 0)
  }

  const calculateGST = () => {
    return medicines.reduce((total, med) => {
      const qty = parseFloat(med.quantity) || 0
      const mrp = parseFloat(med.mrp) || 0
      const gstPercent = parseFloat(med.gst) || 0
      return total + (qty * mrp * (gstPercent / 100))
    }, 0)
  }

  const calculateTotal = () => {
    return medicines.reduce((total, med) => parseFloat(med.amount) || 0, 0)
  }

  const handleSaveAndPrint = async () => {
    // Validate customer phone
    if (customerPhone && !validatePhone(customerPhone)) {
      setPhoneError('Please enter a valid mobile number')
      return
    }

    // Validate at least one medicine is entered
    const hasValidMedicine = medicines.some(med => med.name.trim() !== '')
    if (!hasValidMedicine) {
      alert('Please add at least one medicine')
      return
    }

    try {
      const billData = {
        customerName,
        customerPhone,
        paymentMode,
        medicines: medicines.filter(med => med.name.trim() !== ''),
        totals: {
          subtotal: calculateSubtotal(),
          gst: calculateGST(),
          total: calculateTotal()
        },
        createdAt: new Date().toISOString()
      }

      const response = await pharmacyAPI.billing.create(billData)
      
      if (response.data.success) {
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          // Reset form
          setCustomerName('')
          setCustomerPhone('')
          setMedicines([{
            id: 1,
            name: '',
            batch: '',
            quantity: 1,
            mrp: 0,
            gst: 0,
            amount: 0,
            stock: 50
          }])
        }, 3000)
      }
    } catch (error) {
      console.error('Error saving bill:', error)
      alert('Failed to save bill. Please try again.')
    }
  }

  const subtotal = calculateSubtotal()
  const gst = calculateGST()
  const total = calculateTotal()

  return (
    <div className="billing-container">
      {/* Left Panel - Medicine Entry */}
      <div className="billing-panel">
        <h2 className="panel-title">New Bill</h2>
        
        {/* Customer Information */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="form-group">
            <label className="form-label">Customer Name</label>
            <input
              type="text"
              className="form-input"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              value={customerPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="9876543210"
              maxLength={10}
            />
            {phoneError && <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>{phoneError}</div>}
          </div>
        </div>

        {/* Medicine List */}
        <div className="medicine-list">
          {medicines.map((medicine, index) => (
            <div key={medicine.id} className="medicine-item">
              <div className="medicine-header">
                <input
                  type="text"
                  className="form-input"
                  value={medicine.name}
                  onChange={(e) => handleMedicineNameChange(medicine.id, e.target.value)}
                  placeholder="Search medicine (Paracetamol 650mg, Azithromycin 500mg...)"
                  style={{ flex: 1 }}
                />
                {medicines.length > 1 && (
                  <button
                    className="quantity-btn"
                    onClick={() => removeMedicineRow(medicine.id)}
                    style={{ marginLeft: '8px' }}
                  >
                    🗑️
                  </button>
                )}
              </div>
              
              {/* Suggestions Dropdown */}
              {showSuggestions && currentEditingId === medicine.id && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#16213e',
                  border: '1px solid #0f3460',
                  borderRadius: '8px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  marginTop: '4px'
                }}>
                  {loadingSuggestions ? (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#b8bcc8' }}>
                      Loading...
                    </div>
                  ) : filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectSuggestion(suggestion)}
                        style={{
                          padding: '12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #0f3460',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(0, 208, 132, 0.1)'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >
                        <div style={{ fontWeight: '500', color: '#ffffff' }}>{suggestion.name}</div>
                        <div style={{ fontSize: '12px', color: '#b8bcc8' }}>
                          ₹{suggestion.mrp}/tab | GST: {suggestion.gst}% | Batch: {suggestion.batch}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#b8bcc8' }}>
                      No medicines found
                    </div>
                  )}
                </div>
              )}
              
              <div className="medicine-details">
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={medicine.mrp}
                    onChange={(e) => handleMedicineChange(medicine.id, 'mrp', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <div className="quantity-control">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(medicine.id, -1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={medicine.quantity}
                      onChange={(e) => handleMedicineChange(medicine.id, 'quantity', parseFloat(e.target.value) || 1)}
                      min="1"
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(medicine.id, 1)}
                    >
                      +
                    </button>
                    <span className="stock-indicator">{medicine.stock} avail</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button className="btn btn-primary" onClick={addMedicineRow}>
            ➕ Add to Cart
          </button>
          <button className="btn btn-danger" onClick={() => {
            setMedicines([{
              id: 1,
              name: '',
              batch: '',
              quantity: 1,
              mrp: 0,
              gst: 0,
              amount: 0,
              stock: 50
            }])
          }}>
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Right Panel - Cart Summary */}
      <div className="cart-summary">
        <h3 className="panel-title">Cart Summary</h3>
        
        <table className="cart-table">
          <thead>
            <tr>
              <th>Drug Name</th>
              <th>Qty</th>
              <th>Price/Unit (₹)</th>
              <th>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {medicines.filter(med => med.name.trim() !== '').map((medicine) => (
              <tr key={medicine.id}>
                <td>{medicine.name}</td>
                <td>{medicine.quantity}</td>
                <td>{medicine.mrp}</td>
                <td>{(medicine.quantity * medicine.mrp).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="summary-row">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>GST (12%):</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Grand Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Balance Due:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        {/* Customer and Payment */}
        <div className="form-group" style={{ marginTop: '24px' }}>
          <label className="form-label">Customer</label>
          <select className="form-select" value={customerName} onChange={(e) => setCustomerName(e.target.value)}>
            <option value="">Select Customer</option>
            <option value="Walk-in Customer">Walk-in Customer</option>
            <option value="Rajesh Kumar">Rajesh Kumar</option>
            <option value="Priya Sharma">Priya Sharma</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <div className="payment-mode">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMode === 'cash'}
                onChange={(e) => setPaymentMode(e.target.value)}
              />
              Cash
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMode === 'upi'}
                onChange={(e) => setPaymentMode(e.target.value)}
              />
              UPI
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMode === 'card'}
                onChange={(e) => setPaymentMode(e.target.value)}
              />
              Card
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn btn-secondary">
            📄 Save Draft
          </button>
          <button className="btn btn-secondary">
            🖨️ Print Receipt
          </button>
          <button className="btn btn-primary" onClick={handleSaveAndPrint}>
            ✅ Complete Sale
          </button>
        </div>

        {showSuccess && (
          <div style={{
            background: 'rgba(0, 208, 132, 0.2)',
            border: '1px solid #00d084',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '16px',
            textAlign: 'center',
            color: '#00d084'
          }}>
            ✅ Bill saved successfully!
          </div>
        )}
      </div>
    </div>
  )
}

export default Billing