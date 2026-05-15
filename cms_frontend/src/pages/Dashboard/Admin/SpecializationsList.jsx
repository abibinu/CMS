import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Search } from 'lucide-react';
import api from '../../../api/axios';

const SpecializationsList = () => {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const response = await api.get('/specializations/');
      setSpecializations(response.data);
    } catch (error) {
      console.error('Failed to fetch specializations', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = specializations.filter(s => 
    s.SpecializationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>Medical Specializations</h2>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search specialization..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary" onClick={() => navigate('new')}>
            <Plus size={18} /> Add Specialization
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Specialization Name</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((spec) => (
                  <tr key={spec.SpecializationId}>
                    <td>#{spec.SpecializationId}</td>
                    <td className="font-medium">{spec.SpecializationName}</td>
                    <td className="actions-cell">
                      <button 
                        className="icon-btn edit-btn" 
                        title="Edit"
                        onClick={() => navigate('edit', { state: { specialization: spec } })}
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No specializations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SpecializationsList;
