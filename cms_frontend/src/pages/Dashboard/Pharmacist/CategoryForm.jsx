import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../api/axios';

const CategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editCat = location.state?.category || null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    CategoryName: editCat?.CategoryName || '',
    IsActive: editCat ? editCat.IsActive : true,
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
      if (editCat) {
        await api.put(`/pharmacist/categories/${editCat.MedicineCategoryId}/`, formData);
      } else {
        await api.post('/pharmacist/categories/', formData);
      }
      navigate('/pharmacist-dashboard/categories');
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving the category.');
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
        <h2>{editCat ? 'Edit Category' : 'Add Category'}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Category Name</label>
          <input 
            type="text" 
            name="CategoryName"
            className="input-field" 
            required 
            value={formData.CategoryName} 
            onChange={handleChange} 
            placeholder="e.g. Antibiotics, Painkillers"
          />
        </div>

        {editCat && (
          <div className="input-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="IsActive" id="IsActive" checked={formData.IsActive} onChange={handleChange} />
            <label htmlFor="IsActive" className="input-label" style={{ marginBottom: 0 }}>Active Category</label>
          </div>
        )}

        <div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
