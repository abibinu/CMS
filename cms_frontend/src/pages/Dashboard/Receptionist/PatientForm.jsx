import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../api/axios';

const PatientForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editPatient = location.state?.patient || null;

  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    PatientName: editPatient?.PatientName || '',
    DateOfBirth: editPatient?.DateOfBirth || '',
    Gender: editPatient?.Gender || 'Male',
    MobileNumber: editPatient?.MobileNumber || '',
    Address: editPatient?.Address || '',
    MembershipId: editPatient?.MembershipId || '',
    IsActive: editPatient ? editPatient.IsActive : true,
  });

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await api.get('/memberships/');
        setMemberships(response.data);
      } catch (err) {
        console.error('Failed to load memberships', err);
      }
    };
    fetchMemberships();
  }, []);

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

    const payload = { ...formData };
    if (!payload.MembershipId) {
        payload.MembershipId = null;
    }

    try {
      if (editPatient) {
        await api.put(`/patients/${editPatient.PatientId}/`, payload);
      } else {
        await api.post('/patients/', payload);
      }
      navigate('/receptionist-dashboard/patients');
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving the patient. Please check your inputs.');
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
        <h2>{editPatient ? 'Edit Patient' : 'Register New Patient'}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Patient Name</label>
          <input type="text" name="PatientName" className="input-field" required value={formData.PatientName} onChange={handleChange} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Date of Birth</label>
          <input type="date" name="DateOfBirth" className="input-field" required value={formData.DateOfBirth} onChange={handleChange} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Mobile Number</label>
          <input type="text" name="MobileNumber" className="input-field" required value={formData.MobileNumber} onChange={handleChange} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Gender</label>
          <select name="Gender" className="input-field" value={formData.Gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Membership (Optional)</label>
          <select name="MembershipId" className="input-field" value={formData.MembershipId} onChange={handleChange}>
            <option value="">None</option>
            {memberships.map(mem => (
              <option key={mem.MembershipId} value={mem.MembershipId}>{mem.MembershipType}</option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
          <label className="input-label">Address</label>
          <textarea name="Address" className="input-field" required value={formData.Address} onChange={handleChange} rows="3" />
        </div>

        {editPatient && (
          <div className="input-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="IsActive" id="IsActive" checked={formData.IsActive} onChange={handleChange} />
            <label htmlFor="IsActive" className="input-label" style={{ marginBottom: 0 }}>Active Account</label>
          </div>
        )}

        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
