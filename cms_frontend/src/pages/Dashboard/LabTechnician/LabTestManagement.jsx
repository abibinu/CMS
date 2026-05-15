import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import api from '../../../api/axios';

const LabTestManagement = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await api.get('/labtests/list/');
      setTests(response.data);
    } catch (error) {
      console.error('Failed to fetch lab tests', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this lab test?')) {
      try {
        await api.patch(`/labtests/${id}/deactivate/`);
        fetchTests();
      } catch (error) {
        console.error('Failed to deactivate', error);
        alert('Could not deactivate the test.');
      }
    }
  };

  const filteredTests = tests.filter(test => 
    test.TestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.TestCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>Lab Test Dictionary Management</h2>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search tests..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary" onClick={() => navigate('new')}>
            <Plus size={18} /> Add Lab Test
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading dictionary...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Min Range</th>
                <th>Max Range</th>
                <th>Sample Required</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => (
                  <tr key={test.LabTestId} className={!test.IsActive ? 'inactive-row' : ''}>
                    <td className="font-medium" style={{ color: '#8b5cf6' }}>{test.TestName}</td>
                    <td>{test.ReferenceMinRange}</td>
                    <td>{test.ReferenceMaxRange}</td>
                    <td><span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>{test.SampleRequired}</span></td>
                    <td>
                      <span className={`status-dot ${test.IsActive ? 'active' : 'inactive'}`}></span>
                      {test.IsActive ? 'Active' : 'Inactive'}
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="icon-btn edit-btn" 
                        title="Edit"
                        onClick={() => navigate('edit', { state: { test } })}
                      >
                        <Edit2 size={16} />
                      </button>
                      {test.IsActive && (
                        <button 
                          className="icon-btn delete-btn" 
                          title="Deactivate"
                          onClick={() => handleDeactivate(test.LabTestId)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No lab tests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LabTestManagement;
