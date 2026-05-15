import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Search } from 'lucide-react';
import api from '../../../api/axios';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/');
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(a => 
    a.PatientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.DoctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.ConsultationStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>Appointment Scheduling</h2>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search patient or doctor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary" onClick={() => navigate('new')}>
            <Plus size={18} /> Book Appointment
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Token #</th>
                <th>Date</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <tr key={appt.AppointmentId} className={!appt.IsActive ? 'inactive-row' : ''}>
                    <td className="font-medium" style={{color: 'var(--primary)'}}>#{appt.TokenNumber}</td>
                    <td>{appt.AppointmentDate}</td>
                    <td className="font-medium">{appt.PatientName}</td>
                    <td>Dr. {appt.DoctorName}</td>
                    <td>
                      <span className={`badge ${appt.ConsultationStatus === 'Scheduled' ? '' : 'status-dot inactive'}`}>
                        {appt.ConsultationStatus}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="icon-btn edit-btn" 
                        title="Edit / Reschedule"
                        onClick={() => navigate('edit', { state: { appointment: appt } })}
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
