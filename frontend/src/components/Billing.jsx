import React, { useState, useEffect, useRef } from 'react'

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
      amount: 0
    }
  ])
  const [showSuccess, setShowSuccess] = useState(false)

  // Sample medicine data for autocomplete
  const medicineSuggestions = [
    'Paracetamol 500mg',
    'Azithromycin 250mg',
    'Amoxicillin 500mg',
    'Ibuprofen 400mg',
    'Cetirizine 10mg',
    'Omeprazole 20mg',
    'Metformin 500mg',
    'Aspirin 75mg',
    'Vitamin D3 1000 IU',
    'Cough Syrup 100ml'
  ]

  // Auto-complete functionality
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currentEditingId, setCurrentEditingId] = useState(null)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])

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

  const handleMedicineNameChange = (id, value) => {
    handleMedicineChange(id, 'name', value)
    
    // Handle autocomplete
    setCurrentEditingId(id)
    if (value.length > 0) {
      const filtered = medicineSuggestions.filter(med => 
        med.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (medicineName) => {
    handleMedicineChange(currentEditingId, 'name', medicineName)
    setShowSuggestions(false)
    setCurrentEditingId(null)
  }

  const addMedicineRow = () => {
    const newMedicine = {
      id: Date.now(),
      name: '',
      batch: '',
      quantity: 1,
      mrp: 0,
      gst: 0,
      amount: 0
    }
    setMedicines([...medicines, newMedicine])
  }

  const removeMedicineRow = (id) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter(med => med.id !== id))
    }
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

  const handleSaveAndPrint = () => {
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

    // Show success animation
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)

    // Here you would typically save to backend and trigger print
    console.log('Bill saved:', {
      customer: { name: customerName, phone: customerPhone },
      medicines: medicines.filter(med => med.name.trim() !== ''),
      payment: paymentMode,
      totals: {
        subtotal: calculateSubtotal(),
        gst: calculateGST(),
        total: calculateTotal()
      }
    })

    // Reset form after successful save
    setTimeout(() => {
      resetForm()
    }, 1000)
  }

  const resetForm = () => {
    setCustomerName('')
    setCustomerPhone('')
    setPhoneError('')
    setPaymentMode('cash')
    setMedicines([{
      id: 1,
      name: '',
      batch: '',
      quantity: 1,
      mrp: 0,
      gst: 0,
      amount: 0
    }])
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to clear this bill?')) {
      resetForm()
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e, rowIndex, field) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // Move to next field or next row
      const fields = ['name', 'batch', 'quantity', 'mrp', 'gst']
      const currentFieldIndex = fields.indexOf(field)
      
      if (currentFieldIndex < fields.length - 1) {
        // Move to next field in same row
        const nextField = fields[currentFieldIndex + 1]
        const nextInput = document.querySelector(`input[data-row="${rowIndex}"][data-field="${nextField}"]`)
        if (nextInput) nextInput.focus()
      } else if (rowIndex < medicines.length - 1) {
        // Move to first field of next row
        const nextInput = document.querySelector(`input[data-row="${rowIndex + 1}"][data-field="name"]`)
        if (nextInput) nextInput.focus()
      }
    } else if (e.key === 'ArrowDown' && rowIndex < medicines.length - 1) {
      e.preventDefault()
      const nextInput = document.querySelector(`input[data-row="${rowIndex + 1}"][data-field="${field}"]`)
      if (nextInput) nextInput.focus()
    } else if (e.key === 'ArrowUp' && rowIndex > 0) {
      e.preventDefault()
      const prevInput = document.querySelector(`input[data-row="${rowIndex - 1}"][data-field="${field}"]`)
      if (prevInput) prevInput.focus()
    }
  }

  return (
    <div className={`billing-container ${showSuccess ? 'success-animation' : ''}`}>
      <h2 style={{ marginBottom: '25px', color: '#333' }}>💳 New Bill</h2>
      
      {/* Customer Information */}
      <div className="customer-section">
        <div className="form-group">
          <label htmlFor="customerName">Customer Name *</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="customerPhone">Phone Number *</label>
          <input
            id="customerPhone"
            type="tel"
            value={customerPhone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="Enter 10-digit mobile number"
            className={phoneError ? 'error' : ''}
            maxLength={10}
          />
          {phoneError && <span className="error-message">{phoneError}</span>}
        </div>
      </div>

      {/* Medicine Table */}
      <div className="medicine-table-section">
        <h3 className="section-title">📋 Medicines</h3>
        <table className="medicine-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Medicine Name</th>
              <th style={{ width: '15%' }}>Batch</th>
              <th style={{ width: '10%' }}>Qty</th>
              <th style={{ width: '15%' }}>MRP (₹)</th>
              <th style={{ width: '10%' }}>GST %</th>
              <th style={{ width: '15%' }}>Amount (₹)</th>
              <th style={{ width: '10%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine, index) => (
              <tr key={medicine.id}>
                <td style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={medicine.name}
                    onChange={(e) => handleMedicineNameChange(medicine.id, e.target.value)}
                    placeholder="Medicine name"
                    data-row={index}
                    data-field="name"
                    onKeyDown={(e) => handleKeyDown(e, index, 'name')}
                  />
                  {showSuggestions && currentEditingId === medicine.id && filteredSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'white',
                      border: '1px solid #e1e8ed',
                      borderTop: 'none',
                      borderRadius: '0 0 6px 6px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      {filteredSuggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            borderBottom: '1px solid #f1f3f4'
                          }}
                          onClick={() => selectSuggestion(suggestion)}
                          onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    value={medicine.batch}
                    onChange={(e) => handleMedicineChange(medicine.id, 'batch', e.target.value)}
                    placeholder="Batch no."
                    data-row={index}
                    data-field="batch"
                    onKeyDown={(e) => handleKeyDown(e, index, 'batch')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={medicine.quantity}
                    onChange={(e) => handleMedicineChange(medicine.id, 'quantity', e.target.value)}
                    placeholder="Qty"
                    min="1"
                    data-row={index}
                    data-field="quantity"
                    onKeyDown={(e) => handleKeyDown(e, index, 'quantity')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={medicine.mrp}
                    onChange={(e) => handleMedicineChange(medicine.id, 'mrp', e.target.value)}
                    placeholder="MRP"
                    min="0"
                    step="0.01"
                    data-row={index}
                    data-field="mrp"
                    onKeyDown={(e) => handleKeyDown(e, index, 'mrp')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={medicine.gst}
                    onChange={(e) => handleMedicineChange(medicine.id, 'gst', e.target.value)}
                    placeholder="GST"
                    min="0"
                    max="100"
                    step="0.1"
                    data-row={index}
                    data-field="gst"
                    onKeyDown={(e) => handleKeyDown(e, index, 'gst')}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={medicine.amount.toFixed(2)}
                    readOnly
                    style={{ background: '#f8f9fa', fontWeight: '600', color: '#667eea' }}
                  />
                </td>
                <td>
                  <button
                    className="remove-row-btn"
                    onClick={() => removeMedicineRow(medicine.id)}
                    disabled={medicines.length === 1}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-medicine-btn" onClick={addMedicineRow}>
          ➕ Add Medicine
        </button>
      </div>

      {/* Billing Summary */}
      <div className="billing-summary">
        <div className="summary-row">
          <span className="summary-label">Subtotal:</span>
          <span className="summary-value">₹{calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">GST Amount:</span>
          <span className="summary-value">₹{calculateGST().toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total Amount:</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Mode */}
      <div className="payment-section">
        <div className="form-group">
          <label>Payment Mode</label>
          <div className="payment-mode">
            <label className="radio-group">
              <input
                type="radio"
                name="paymentMode"
                value="cash"
                checked={paymentMode === 'cash'}
                onChange={(e) => setPaymentMode(e.target.value)}
              />
              <span>💵 Cash</span>
            </label>
            <label className="radio-group">
              <input
                type="radio"
                name="paymentMode"
                value="credit"
                checked={paymentMode === 'credit'}
                onChange={(e) => setPaymentMode(e.target.value)}
              />
              <span>💳 Credit</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Quick Actions</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="add-medicine-btn" 
              onClick={() => window.print()}
              style={{ background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)' }}
            >
              🖨️ Print Preview
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="cancel-btn" onClick={handleCancel}>
          ❌ Cancel
        </button>
        <button className="save-print-btn" onClick={handleSaveAndPrint}>
          💾 Save & Print Invoice
        </button>
      </div>

      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
          color: 'white',
          padding: '20px 40px',
          borderRadius: '12px',
          fontSize: '18px',
          fontWeight: 'bold',
          zIndex: 10000,
          boxShadow: '0 4px 20px rgba(46, 204, 113, 0.4)'
        }}>
          ✅ Bill Saved Successfully!
        </div>
      )}
    </div>
  )
}

export default Billing