import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../api/axios';

const LabTestForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editTest = location.state?.test || null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    TestName: editTest?.TestName || '',
    Amount: editTest?.Amount || '',
    ReferenceMinRange: editTest?.ReferenceMinRange || '',
    ReferenceMaxRange: editTest?.ReferenceMaxRange || '',
    SampleRequired: editTest?.SampleRequired || '',
    LabTestCategoryId: editTest?.LabTestCategoryId || 1, // Fallback to 1 if no categories API exists
    IsActive: editTest ? editTest.IsActive : true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editTest) {
        await api.put(`/labtests/${editTest.LabTestId}/`, formData);
      } else {
        await api.post('/labtests/', formData);
      }
      navigate('/labtechnician-dashboard/management');
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving the lab test. Please check inputs.');
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
        <h2>{editTest ? 'Edit Lab Test' : 'Add New Lab Test'}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Test Name</label>
          <input type="text" name="TestName" className="input-field" required value={formData.TestName} onChange={handleChange} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Cost / Amount (₹)</label>
          <input type="number" step="0.01" name="Amount" className="input-field" required value={formData.Amount} onChange={handleChange} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Reference Min Range</label>
          <input type="text" name="ReferenceMinRange" className="input-field" required value={formData.ReferenceMinRange} onChange={handleChange} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Reference Max Range</label>
          <input type="text" name="ReferenceMaxRange" className="input-field" required value={formData.ReferenceMaxRange} onChange={handleChange} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Sample Required (e.g. Blood, Urine)</label>
          <input type="text" name="SampleRequired" className="input-field" required value={formData.SampleRequired} onChange={handleChange} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Category ID</label>
          <input type="number" name="LabTestCategoryId" className="input-field" required value={formData.LabTestCategoryId} onChange={handleChange} />
        </div>

        {editTest && (
          <div className="input-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="IsActive" id="IsActive" checked={formData.IsActive} onChange={handleChange} />
            <label htmlFor="IsActive" className="input-label" style={{ marginBottom: 0 }}>Active Profile</label>
          </div>
        )}

        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Lab Test'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LabTestForm;
