import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import api from '../../../api/axios';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors/');
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this doctor profile?')) {
      try {
        await api.patch(`/doctors/${id}/deactivate/`);
        fetchDoctors(); // refresh list
      } catch (error) {
        console.error('Failed to deactivate', error);
        alert('Could not deactivate the doctor.');
      }
    }
  };

  const filteredDoctors = doctors.filter(d => 
    d.DoctorName?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
    d.SpecializationName?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>Doctor Profiles</h2>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by name or specialization..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary" onClick={() => navigate('new')}>
            <Plus size={18} /> Add Doctor Profile
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading doctor profiles...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Profile ID</th>
                <th>Doctor Name</th>
                <th>Specialization</th>
                <th>Consultation Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc) => (
                  <tr key={doc.DoctorId} className={!doc.IsActive ? 'inactive-row' : ''}>
                    <td>#{doc.DoctorId}</td>
                    <td className="font-medium">{doc.DoctorName}</td>
                    <td><span className="badge">{doc.SpecializationName}</span></td>
                    <td>₹{doc.ConsultationFee}</td>
                    <td>
                      <span className={`status-dot ${doc.IsActive ? 'active' : 'inactive'}`}></span>
                      {doc.IsActive ? 'Active' : 'Inactive'}
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="icon-btn edit-btn" 
                        title="Edit"
                        onClick={() => navigate('edit', { state: { doctor: doc } })}
                      >
                        <Edit2 size={16} />
                      </button>
                      {doc.IsActive && (
                        <button 
                          className="icon-btn delete-btn" 
                          title="Deactivate"
                          onClick={() => handleDeactivate(doc.DoctorId)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No doctor profiles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
