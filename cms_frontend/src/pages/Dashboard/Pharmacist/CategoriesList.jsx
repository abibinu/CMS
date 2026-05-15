import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import api from '../../../api/axios';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/pharmacist/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this category?')) {
      try {
        await api.patch(`/pharmacist/categories/${id}/deactivate/`);
        fetchCategories();
      } catch (error) {
        console.error('Failed to deactivate', error);
        alert('Could not deactivate category.');
      }
    }
  };

  const filtered = categories.filter(c => 
    c.CategoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>Medicine Categories</h2>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary" onClick={() => navigate('new')}>
            <Plus size={18} /> Add Category
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((cat) => (
                  <tr key={cat.MedicineCategoryId} className={!cat.IsActive ? 'inactive-row' : ''}>
                    <td>#{cat.MedicineCategoryId}</td>
                    <td className="font-medium">{cat.CategoryName}</td>
                    <td>
                      <span className={`status-dot ${cat.IsActive ? 'active' : 'inactive'}`}></span>
                      {cat.IsActive ? 'Active' : 'Inactive'}
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="icon-btn edit-btn" 
                        title="Edit"
                        onClick={() => navigate('edit', { state: { category: cat } })}
                      >
                        <Edit2 size={16} />
                      </button>
                      {cat.IsActive && (
                        <button 
                          className="icon-btn delete-btn" 
                          title="Deactivate"
                          onClick={() => handleDeactivate(cat.MedicineCategoryId)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
