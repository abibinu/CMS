import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../api/axios';

const InventoryForm = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Combined state since we need to hit two endpoints
  const [formData, setFormData] = useState({
    MedicineName: '',
    ManufacturingDate: '',
    ExpiryDate: '',
    Unit: 'Tablet',
    MedicineCategoryId: '',
    StockInHand: 0,
    ReOrderLevel: 10,
    Purchase: 0,
    Issuance: 0
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/pharmacist/categories/');
        setCategories(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({...prev, MedicineCategoryId: response.data[0].MedicineCategoryId}));
        }
      } catch (err) {
        console.error('Failed to load categories', err);
        setError('Failed to load medicine categories.');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create the Medicine
      const medicinePayload = {
        MedicineName: formData.MedicineName,
        ManufacturingDate: formData.ManufacturingDate,
        ExpiryDate: formData.ExpiryDate,
        Unit: formData.Unit,
        MedicineCategoryId: formData.MedicineCategoryId,
        IsActive: true
      };
      
      const medicineRes = await api.post('/pharmacist/medicines/', medicinePayload);
      const newMedicineId = medicineRes.data.MedicineId;

      // 2. Create the associated Stock
      const stockPayload = {
        MedicineId: newMedicineId,
        StockInHand: parseInt(formData.StockInHand),
        ReOrderLevel: parseInt(formData.ReOrderLevel),
        Purchase: parseInt(formData.Purchase),
        Issuance: 0,
        IsActive: true
      };

      await api.post('/pharmacist/inventory/', stockPayload);
      
      navigate('/pharmacist-dashboard/inventory');
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving the inventory. Please check all required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', background: '#f1f5f9' }}>
          <ArrowLeft size={20} />
        </button>
        <h2>Add New Medicine to Inventory</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        
        {/* Medicine Details */}
        <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.1rem' }}>Medicine Details</h3>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Medicine Name</label>
          <input type="text" name="MedicineName" className="input-field" required value={formData.MedicineName} onChange={handleChange} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Category</label>
          <select name="MedicineCategoryId" className="input-field" value={formData.MedicineCategoryId} onChange={handleChange} required>
            {categories.map(c => (
              <option key={c.MedicineCategoryId} value={c.MedicineCategoryId}>{c.MedicineCategoryName}</option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Unit Type</label>
          <select name="Unit" className="input-field" value={formData.Unit} onChange={handleChange}>
            <option value="Tablet">Tablet</option>
            <option value="Syrup">Syrup (Bottle)</option>
            <option value="Injection">Injection</option>
            <option value="Ointment">Ointment</option>
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Manufacturing Date</label>
          <input type="date" name="ManufacturingDate" className="input-field" required value={formData.ManufacturingDate} onChange={handleChange} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Expiry Date</label>
          <input type="date" name="ExpiryDate" className="input-field" required value={formData.ExpiryDate} onChange={handleChange} />
        </div>

        {/* Stock Details */}
        <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.1rem' }}>Initial Stock Levels</h3>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Initial Purchase Quantity</label>
          <input type="number" min="0" name="Purchase" className="input-field" required value={formData.Purchase} onChange={(e) => {
            handleChange(e);
            // Automatically mirror purchase to initial stock in hand
            setFormData(prev => ({...prev, StockInHand: e.target.value}));
          }} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Stock In Hand</label>
          <input type="number" min="0" name="StockInHand" className="input-field" required value={formData.StockInHand} onChange={handleChange} readOnly style={{ background: '#f8fafc' }} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Re-Order Level (Alert Threshold)</label>
          <input type="number" min="0" name="ReOrderLevel" className="input-field" required value={formData.ReOrderLevel} onChange={handleChange} />
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={loading || categories.length === 0}>
            {loading ? 'Saving...' : 'Save Medicine & Stock'}
          </button>
          {categories.length === 0 && <p style={{color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem'}}>Warning: No categories found. Please ask an Administrator to add Medicine Categories in the backend.</p>}
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;
