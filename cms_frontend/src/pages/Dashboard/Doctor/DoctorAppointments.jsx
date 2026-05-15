import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Stethoscope } from 'lucide-react';
import api from '../../../api/axios';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyQueue();
  }, []);

  const fetchMyQueue = async () => {
    try {
      // 1. Get logged in Staff ID
      const currentStaffId = parseInt(localStorage.getItem('staff_id'));

      // 2. Find the DoctorId for this Staff
      const doctorsRes = await api.get('/doctors/');
      const myDoctorProfile = doctorsRes.data.find(d => d.StaffId === currentStaffId);

      if (!myDoctorProfile) {
        console.warn("No Doctor Profile found for this user!");
        setLoading(false);
        return;
      }

      // 3. Fetch all appointments and filter by my DoctorId AND 'Scheduled' status
      const apptRes = await api.get('/appointments/');
      const myQueue = apptRes.data.filter(
        a => a.DoctorId === myDoctorProfile.DoctorId && a.ConsultationStatus === 'Scheduled' && a.IsActive
      );
      
      setAppointments(myQueue);
    } catch (error) {
      console.error('Failed to fetch doctor queue', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQueue = appointments.filter(a => 
    a.PatientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>My Consultation Queue</h2>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search patient..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading queue...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Token #</th>
                <th>Time / Date</th>
                <th>Patient Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.length > 0 ? (
                filteredQueue.map((appt) => (
                  <tr key={appt.AppointmentId}>
                    <td className="font-medium" style={{color: 'var(--primary)', fontSize: '1.2rem'}}>#{appt.TokenNumber}</td>
                    <td>{appt.AppointmentDate}</td>
                    <td className="font-medium">{appt.PatientName}</td>
                    <td><span className="badge">Waiting</span></td>
                    <td className="actions-cell">
                      <button 
                        className="btn-primary" 
                        style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        onClick={() => navigate(`consult/${appt.AppointmentId}`, { state: { appointment: appt } })}
                      >
                        <Stethoscope size={16} /> Consult
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{color: 'var(--text-muted)'}}>
                      <Stethoscope size={48} style={{opacity: 0.2, marginBottom: '1rem'}} />
                      <p>Your queue is empty!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
