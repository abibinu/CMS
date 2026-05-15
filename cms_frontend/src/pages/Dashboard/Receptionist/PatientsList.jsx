import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Search } from 'lucide-react';
import api from '../../../api/axios';
import '../Admin/Admin.css'; // Reusing admin table styles

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients/');
      setPatients(response.data);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.PatientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.MobileNumber.includes(searchTerm)
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>Patient Management</h2>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search name or mobile..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary" onClick={() => navigate('new')}>
            <Plus size={18} /> Register Patient
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading patient data...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Mobile Number</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Membership</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.PatientId} className={!patient.IsActive ? 'inactive-row' : ''}>
                    <td>#{patient.PatientId}</td>
                    <td className="font-medium">{patient.PatientName}</td>
                    <td>{patient.MobileNumber}</td>
                    <td>{patient.Gender}</td>
                    <td>{patient.DateOfBirth}</td>
                    <td><span className="badge">{patient.MembershipName || 'None'}</span></td>
                    <td className="actions-cell">
                      <button 
                        className="icon-btn edit-btn" 
                        title="Edit"
                        onClick={() => navigate('edit', { state: { patient } })}
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientsList;
