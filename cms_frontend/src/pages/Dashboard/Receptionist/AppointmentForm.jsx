import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../api/axios';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editAppt = location.state?.appointment || null;

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    PatientId: editAppt?.PatientId || '',
    DoctorId: editAppt?.DoctorId || '',
    AppointmentDate: editAppt?.AppointmentDate || new Date().toISOString().split('T')[0],
    ConsultationStatus: editAppt?.ConsultationStatus || 'Scheduled',
    IsActive: editAppt ? editAppt.IsActive : true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          api.get('/patients/'),
          api.get('/doctors/')
        ]);
        
        // Filter only active patients for the dropdown
        const activePatients = patientsRes.data.filter(p => p.IsActive);
        setPatients(activePatients);
        setDoctors(doctorsRes.data);

        if (!editAppt) {
            if (activePatients.length > 0) setFormData(prev => ({...prev, PatientId: activePatients[0].PatientId}));
            if (doctorsRes.data.length > 0) setFormData(prev => ({...prev, DoctorId: doctorsRes.data[0].DoctorId}));
        }
      } catch (err) {
        console.error('Failed to load form data', err);
        setError('Failed to load patients and doctors.');
      }
    };
    fetchData();
  }, [editAppt]);

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
      if (editAppt) {
        await api.put(`/appointments/${editAppt.AppointmentId}/`, formData);
      } else {
        // Token number is auto-calculated by the backend serializer
        await api.post('/appointments/', formData);
      }
      navigate('/receptionist-dashboard/appointments');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred while saving the appointment.');
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
        <h2>{editAppt ? 'Update Appointment' : 'Book Appointment'}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Patient</label>
          <select name="PatientId" className="input-field" value={formData.PatientId} onChange={handleChange} required>
            {patients.map(p => (
              <option key={p.PatientId} value={p.PatientId}>{p.PatientName} ({p.MobileNumber})</option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Doctor</label>
          <select name="DoctorId" className="input-field" value={formData.DoctorId} onChange={handleChange} required>
            {doctors.map(d => (
              <option key={d.DoctorId} value={d.DoctorId}>Dr. {d.DoctorName} ({d.SpecializationName})</option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Date</label>
          <input type="date" name="AppointmentDate" className="input-field" required value={formData.AppointmentDate} onChange={handleChange} />
        </div>

        {editAppt && (
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Consultation Status</label>
            <select name="ConsultationStatus" className="input-field" value={formData.ConsultationStatus} onChange={handleChange}>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        )}

        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : (editAppt ? 'Update Appointment' : 'Book Appointment')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
