import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../api/axios';

const SpecializationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editSpec = location.state?.specialization || null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState(editSpec?.SpecializationName || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editSpec) {
        await api.put(`/specializations/${editSpec.SpecializationId}/`, { SpecializationName: name });
      } else {
        await api.post('/specializations/', { SpecializationName: name });
      }
      navigate('/administrator-dashboard/specializations');
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please ensure the name is unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', background: '#f1f5f9' }}>
          <ArrowLeft size={20} />
        </button>
        <h2>{editSpec ? 'Edit Specialization' : 'Add Specialization'}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Specialization Name</label>
          <input 
            type="text" 
            className="input-field" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. Cardiologist, Dermatologist"
          />
        </div>

        <div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Specialization'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpecializationForm;
