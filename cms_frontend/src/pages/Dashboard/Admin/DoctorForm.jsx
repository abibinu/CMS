import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../api/axios';

const DoctorForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editDoctor = location.state?.doctor || null;

  const [staffList, setStaffList] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    StaffId: editDoctor?.StaffId || '',
    SpecializationId: editDoctor?.SpecializationId || '',
    ConsultationFee: editDoctor?.ConsultationFee || '',
    IsActive: editDoctor ? editDoctor.IsActive : true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, specRes] = await Promise.all([
          api.get('/staff/'),
          api.get('/specializations/')
        ]);
        
        // Filter staff to only show active ones, maybe only those with 'Doctor' role
        // For flexibility, we just show active staff.
        const activeStaff = staffRes.data.filter(s => s.IsActive);
        setStaffList(activeStaff);
        setSpecializations(specRes.data);

        if (!editDoctor) {
          if (activeStaff.length > 0) setFormData(prev => ({...prev, StaffId: activeStaff[0].StaffId}));
          if (specRes.data.length > 0) setFormData(prev => ({...prev, SpecializationId: specRes.data[0].SpecializationId}));
        }
      } catch (err) {
        console.error('Failed to load form dependencies', err);
        setError('Failed to load staff or specializations from the server.');
      }
    };
    fetchData();
  }, [editDoctor]);

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
      if (editDoctor) {
        await api.put(`/doctors/${editDoctor.DoctorId}/`, formData);
      } else {
        await api.post('/doctors/', formData);
      }
      navigate('/administrator-dashboard/doctors');
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving the doctor profile.');
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
        <h2>{editDoctor ? 'Edit Doctor Profile' : 'Add New Doctor Profile'}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Select Staff Account</label>
          <select name="StaffId" className="input-field" value={formData.StaffId} onChange={handleChange} required disabled={editDoctor}>
            <option value="">-- Select Staff --</option>
            {staffList.map(s => (
              <option key={s.StaffId} value={s.StaffId}>{s.FullName} ({s.RoleName})</option>
            ))}
          </select>
          {!editDoctor && <small style={{color:'var(--text-muted)'}}>Note: You must create a Staff account for the doctor first.</small>}
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Specialization</label>
          <select name="SpecializationId" className="input-field" value={formData.SpecializationId} onChange={handleChange} required>
            <option value="">-- Select Specialization --</option>
            {specializations.map(s => (
              <option key={s.SpecializationId} value={s.SpecializationId}>{s.SpecializationName}</option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Consultation Fee (₹)</label>
          <input type="number" step="0.01" min="0" name="ConsultationFee" className="input-field" required value={formData.ConsultationFee} onChange={handleChange} />
        </div>

        {editDoctor && (
          <div className="input-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="IsActive" id="IsActive" checked={formData.IsActive} onChange={handleChange} />
            <label htmlFor="IsActive" className="input-label" style={{ marginBottom: 0 }}>Active Profile</label>
          </div>
        )}

        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={loading || staffList.length === 0 || specializations.length === 0}>
            {loading ? 'Saving...' : 'Save Doctor Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
