import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../api/axios';

const BillingForm = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    AppointmentId: '',
    RegistrationCharge: 0,
    AdditionalCharges: 0,
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments/');
        // Only allow billing for Completed appointments that are active
        const completedAppts = response.data.filter(a => a.ConsultationStatus === 'Completed' && a.IsActive);
        setAppointments(completedAppts);

        if (completedAppts.length > 0) {
            setFormData(prev => ({...prev, AppointmentId: completedAppts[0].AppointmentId}));
        }
      } catch (err) {
        console.error('Failed to load appointments', err);
        setError('Failed to load completed appointments.');
      }
    };
    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Total amount and consultation fee are automatically calculated by the backend!
      await api.post('/billing/', formData);
      navigate('/receptionist-dashboard/billing');
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the bill. Ensure this appointment does not already have a bill.');
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
        <h2>Generate Bill</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        
        <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
          <label className="input-label">Select Completed Appointment</label>
          <select name="AppointmentId" className="input-field" value={formData.AppointmentId} onChange={handleChange} required>
            <option value="" disabled>Select an appointment...</option>
            {appointments.map(a => (
              <option key={a.AppointmentId} value={a.AppointmentId}>
                {a.AppointmentDate} - {a.PatientName} (Dr. {a.DoctorName})
              </option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Registration Charge (₹)</label>
          <input type="number" step="0.01" name="RegistrationCharge" className="input-field" required value={formData.RegistrationCharge} onChange={handleChange} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Additional Charges (₹)</label>
          <input type="number" step="0.01" name="AdditionalCharges" className="input-field" required value={formData.AdditionalCharges} onChange={handleChange} />
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '1rem', padding: '1rem', background: '#eff6ff', borderRadius: '12px' }}>
          <p style={{ margin: 0, color: 'var(--primary)', fontSize: '0.875rem' }}>
            <strong>Note:</strong> The Consultation Fee is automatically retrieved from the Doctor's profile. The Total Amount will be accurately calculated by the backend server.
          </p>
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={loading || appointments.length === 0}>
            {loading ? 'Processing...' : 'Generate Bill'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingForm;
