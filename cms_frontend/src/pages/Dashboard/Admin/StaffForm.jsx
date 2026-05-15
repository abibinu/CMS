import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../api/axios';

const StaffForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editStaff = location.state?.staff || null;

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    FullName: editStaff?.FullName || '',
    UserName: editStaff?.UserName || '',
    Password: '', // Only required on create
    Gender: editStaff?.Gender || 'Male',
    MobileNumber: editStaff?.MobileNumber || '',
    RoleId: editStaff?.RoleId || '',
    IsActive: editStaff ? editStaff.IsActive : true,
  });

  useEffect(() => {
    // Fetch roles for the dropdown
    const fetchRoles = async () => {
      try {
        const response = await api.get('/roles/');
        setRoles(response.data);
        if (!editStaff && response.data.length > 0) {
          setFormData(prev => ({ ...prev, RoleId: response.data[0].RoleId }));
        }
      } catch (err) {
        console.error('Failed to load roles', err);
        setError('Failed to load roles from the server.');
      }
    };
    fetchRoles();
  }, [editStaff]);

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

    // If editing, don't send password if it's empty
    const payload = { ...formData };
    if (editStaff && !payload.Password) {
      delete payload.Password;
    }

    try {
      if (editStaff) {
        await api.put(`/staff/${editStaff.StaffId}/`, payload);
      } else {
        await api.post('/staff/', payload);
      }
      navigate('/administrator-dashboard/staff');
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving the staff member. Ensure the username is unique.');
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
        <h2>{editStaff ? 'Edit Staff Member' : 'Add New Staff'}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Full Name</label>
          <input type="text" name="FullName" className="input-field" required value={formData.FullName} onChange={handleChange} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Username</label>
          <input type="text" name="UserName" className="input-field" required value={formData.UserName} onChange={handleChange} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Password {editStaff && <span style={{fontSize: '0.8em', color: 'gray'}}>(Leave blank to keep current)</span>}</label>
          <input type="password" name="Password" className="input-field" required={!editStaff} value={formData.Password} onChange={handleChange} />
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
          <label className="input-label">Role</label>
          <select name="RoleId" className="input-field" value={formData.RoleId} onChange={handleChange} required>
            {roles.map(role => (
              <option key={role.RoleId} value={role.RoleId}>{role.RoleName}</option>
            ))}
          </select>
        </div>

        {editStaff && (
          <div className="input-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="IsActive" id="IsActive" checked={formData.IsActive} onChange={handleChange} />
            <label htmlFor="IsActive" className="input-label" style={{ marginBottom: 0 }}>Active Account</label>
          </div>
        )}

        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Staff Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;
