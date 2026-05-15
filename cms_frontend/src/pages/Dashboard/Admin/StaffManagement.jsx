import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import api from '../../../api/axios';
import './Admin.css';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/staff/');
      setStaff(response.data);
    } catch (error) {
      console.error('Failed to fetch staff', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this staff member?')) {
      try {
        await api.patch(`/staff/${id}/deactivate/`);
        fetchStaff(); // refresh list
      } catch (error) {
        console.error('Failed to deactivate', error);
        alert('Could not deactivate the user.');
      }
    }
  };

  const filteredStaff = staff.filter(s => 
    s.FullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.RoleName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>Staff Management</h2>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary" onClick={() => navigate('new')}>
            <Plus size={18} /> Add Staff
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading staff data...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((person) => (
                  <tr key={person.StaffId} className={!person.IsActive ? 'inactive-row' : ''}>
                    <td>#{person.StaffId}</td>
                    <td className="font-medium">{person.FullName}</td>
                    <td>{person.UserName}</td>
                    <td><span className="badge">{person.RoleName}</span></td>
                    <td>{person.MobileNumber}</td>
                    <td>
                      <span className={`status-dot ${person.IsActive ? 'active' : 'inactive'}`}></span>
                      {person.IsActive ? 'Active' : 'Inactive'}
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="icon-btn edit-btn" 
                        title="Edit"
                        onClick={() => navigate('edit', { state: { staff: person } })}
                      >
                        <Edit2 size={16} />
                      </button>
                      {person.IsActive && (
                        <button 
                          className="icon-btn delete-btn" 
                          title="Deactivate"
                          onClick={() => handleDeactivate(person.StaffId)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No staff found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
