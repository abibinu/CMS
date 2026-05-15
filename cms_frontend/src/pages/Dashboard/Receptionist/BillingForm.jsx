import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../api/axios';

const BillingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editBill = location.state?.bill || null;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    AppointmentId: editBill?.AppointmentId || '',
    RegistrationCharge: parseFloat(editBill?.RegistrationCharge) || 0,
    AdditionalCharges: parseFloat(editBill?.AdditionalCharges) || 0,
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments/');
        // Only allow billing for Completed appointments that are active
        const completedAppts = response.data.filter(a => a.ConsultationStatus === 'Completed' && a.IsActive);
        setAppointments(completedAppts);

        if (!editBill && completedAppts.length > 0) {
            setFormData(prev => ({...prev, AppointmentId: completedAppts[0].AppointmentId}));
        }
      } catch (err) {
        console.error('Failed to load appointments', err);
        setError('Failed to load completed appointments.');
      }
    };
    fetchAppointments();
  }, [editBill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Ensure numeric fields are numbers, not strings
    const submitData = {
      RegistrationCharge: parseFloat(formData.RegistrationCharge) || 0,
      AdditionalCharges: parseFloat(formData.AdditionalCharges) || 0,
    };

    if (!editBill) {
      submitData.AppointmentId = parseInt(formData.AppointmentId);
    }

    try {
      if (editBill) {
        await api.patch(`/billing/${editBill.BillId}/`, submitData);
      } else {
        await api.post('/billing/', submitData);
      }
      navigate('/receptionist-dashboard/billing');
    } catch (err) {
      console.error('Bill save error:', err);
      console.error('Error response:', err.response?.data);
      
      // Try to extract detailed error message from response
      let errorMsg = 'An error occurred while saving the bill.';
      const errorData = err.response?.data;
      
      if (typeof errorData === 'string') {
        errorMsg = errorData;
      } else if (errorData?.detail) {
        errorMsg = errorData.detail;
      } else if (errorData?.AppointmentId && Array.isArray(errorData.AppointmentId)) {
        errorMsg = errorData.AppointmentId[0];
      } else if (errorData?.AppointmentId && typeof errorData.AppointmentId === 'string') {
        errorMsg = errorData.AppointmentId;
      } else if (errorData?.RegistrationCharge && Array.isArray(errorData.RegistrationCharge)) {
        errorMsg = `Registration Charge: ${errorData.RegistrationCharge[0]}`;
      } else if (errorData?.AdditionalCharges && Array.isArray(errorData.AdditionalCharges)) {
        errorMsg = `Additional Charges: ${errorData.AdditionalCharges[0]}`;
      } else if (typeof errorData === 'object') {
        // If error data is an object, try to extract the first error message
        const firstError = Object.values(errorData).find(val => typeof val === 'string' || Array.isArray(val));
        if (firstError) {
          errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
        }
      }
      
      setError(errorMsg);
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
        <h2>{editBill ? 'Edit Bill' : 'Generate Bill'}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!editBill && appointments.length === 0 && (
        <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '8px', color: '#991b1b', marginBottom: '1rem' }}>
          <strong>No completed appointments available.</strong> Please mark an appointment as "Completed" in the Appointments section before generating a bill.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        
        <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
          <label className="input-label">Select Completed Appointment</label>
          <select name="AppointmentId" className="input-field" value={formData.AppointmentId} onChange={handleChange} required disabled={editBill}>
            <option value="" disabled>Select an appointment...</option>
            {editBill && <option value={editBill.AppointmentId}>Appointment #{editBill.AppointmentId} - {editBill.PatientName}</option>}
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
          <button type="submit" className="btn-primary" disabled={loading || (!editBill && appointments.length === 0)}>
            {loading ? 'Processing...' : (editBill ? 'Update Bill' : 'Generate Bill')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingForm;
