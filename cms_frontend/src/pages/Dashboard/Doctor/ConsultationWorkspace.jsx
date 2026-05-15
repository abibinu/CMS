import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, CheckCircle } from 'lucide-react';
import api from '../../../api/axios';

const ConsultationWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state?.appointment || null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Dropdown data
  const [medicines, setMedicines] = useState([]);
  const [labTests, setLabTests] = useState([]);

  // Form States
  const [consultation, setConsultation] = useState({ Symptoms: '', Diagnosis: '', Notes: '' });
  const [medPrescriptions, setMedPrescriptions] = useState([]);
  const [labPrescriptions, setLabPrescriptions] = useState([]);

  useEffect(() => {
    if (!appointment) {
      navigate('/doctor-dashboard');
      return;
    }
    
    // Fetch dropdowns
    const fetchOptions = async () => {
      try {
        const [medRes, labRes] = await Promise.all([
          api.get('/pharmacist/medicines/'),
          api.get('/labtests/list/')
        ]);
        setMedicines(medRes.data);
        setLabTests(labRes.data);
      } catch (err) {
        console.error("Failed to fetch medicines or lab tests", err);
      }
    };
    fetchOptions();
  }, [appointment, navigate]);

  // --- Medicine Handlers ---
  const addMedicine = () => {
    setMedPrescriptions([...medPrescriptions, { MedicineId: '', Dosage: '', Frequency: '', Duration: '' }]);
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...medPrescriptions];
    updated[index][field] = value;
    setMedPrescriptions(updated);
  };

  const removeMedicine = (index) => {
    setMedPrescriptions(medPrescriptions.filter((_, i) => i !== index));
  };

  // --- Lab Test Handlers ---
  const addLabTest = () => {
    setLabPrescriptions([...labPrescriptions, { LabTestId: '', Remarks: '' }]);
  };

  const updateLabTest = (index, field, value) => {
    const updated = [...labPrescriptions];
    updated[index][field] = value;
    setLabPrescriptions(updated);
  };

  const removeLabTest = (index) => {
    setLabPrescriptions(labPrescriptions.filter((_, i) => i !== index));
  };

  // --- Submit Handler ---
  const handleSubmit = async () => {
    if (!consultation.Symptoms || !consultation.Diagnosis) {
      setError("Symptoms and Diagnosis are required!");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Post Consultation
      await api.post('/consultations/', {
        ...consultation,
        AppointmentId: id
      });

      // 2. Post Medicine Prescriptions (Batch if available, or loop)
      if (medPrescriptions.length > 0) {
        const medPayload = medPrescriptions.filter(m => m.MedicineId).map(m => ({
          ...m, AppointmentId: id
        }));
        if (medPayload.length > 0) {
          await api.post('/prescriptions/medicine/', medPayload);
        }
      }

      // 3. Post Lab Test Prescriptions (Batch if available, or loop)
      if (labPrescriptions.length > 0) {
        const labPayload = labPrescriptions.filter(l => l.LabTestId).map(l => ({
          ...l, AppointmentId: id
        }));
        if (labPayload.length > 0) {
          // Lab API might not support batching yet, so we map requests safely
          try {
             await api.post('/prescriptions/labtest/', labPayload);
          } catch(e) {
             // Fallback to individual requests if batch fails
             await Promise.all(labPayload.map(lp => api.post('/prescriptions/labtest/', lp)));
          }
        }
      }

      // 4. Mark Appointment as Completed
      await api.put(`/appointments/${id}/`, {
        ...appointment,
        ConsultationStatus: 'Completed'
      });

      alert("Consultation saved successfully!");
      navigate('/doctor-dashboard');

    } catch (err) {
      console.error(err);
      setError("An error occurred while saving the consultation. Please check required fields.");
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) return null;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ margin: 0 }}>Consultation Workspace</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            Patient: <strong>{appointment.PatientName}</strong> | Token: <strong>#{appointment.TokenNumber}</strong>
          </p>
        </div>
      </div>

      {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {/* Clinical Notes Section */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
          Clinical Notes
        </h3>
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
          <div className="input-group">
            <label className="input-label">Symptoms <span style={{color: 'red'}}>*</span></label>
            <textarea 
              className="input-field" rows="4" value={consultation.Symptoms} 
              onChange={e => setConsultation({...consultation, Symptoms: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Diagnosis <span style={{color: 'red'}}>*</span></label>
            <textarea 
              className="input-field" rows="4" value={consultation.Diagnosis} 
              onChange={e => setConsultation({...consultation, Diagnosis: e.target.value})} 
            />
          </div>
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label className="input-label">Additional Notes</label>
            <textarea 
              className="input-field" rows="2" value={consultation.Notes} 
              onChange={e => setConsultation({...consultation, Notes: e.target.value})} 
            />
          </div>
        </div>
      </div>

      {/* Medicines Section */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--primary)' }}>Medicine Prescriptions</h3>
          <button className="btn-secondary" onClick={addMedicine} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', display: 'flex', gap: '0.5rem' }}>
            <Plus size={14} /> Add Medicine
          </button>
        </div>
        
        {medPrescriptions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No medicines prescribed yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {medPrescriptions.map((med, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ flex: 2 }}>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Medicine</label>
                  <select className="input-field" value={med.MedicineId} onChange={(e) => updateMedicine(index, 'MedicineId', e.target.value)}>
                    <option value="">Select Medicine...</option>
                    {medicines.map(m => <option key={m.MedicineId} value={m.MedicineId}>{m.MedicineName}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Dosage</label>
                  <input type="text" className="input-field" placeholder="e.g. 500mg" value={med.Dosage} onChange={(e) => updateMedicine(index, 'Dosage', e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Frequency</label>
                  <input type="text" className="input-field" placeholder="e.g. 1-0-1" value={med.Frequency} onChange={(e) => updateMedicine(index, 'Frequency', e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Duration</label>
                  <input type="text" className="input-field" placeholder="e.g. 5 Days" value={med.Duration} onChange={(e) => updateMedicine(index, 'Duration', e.target.value)} />
                </div>
                <button onClick={() => removeMedicine(index)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', marginTop: '1.5rem', padding: '0.5rem' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lab Tests Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--primary)' }}>Lab Test Prescriptions</h3>
          <button className="btn-secondary" onClick={addLabTest} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', display: 'flex', gap: '0.5rem' }}>
            <Plus size={14} /> Add Lab Test
          </button>
        </div>

        {labPrescriptions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No lab tests prescribed yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {labPrescriptions.map((test, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Lab Test</label>
                  <select className="input-field" value={test.LabTestId} onChange={(e) => updateLabTest(index, 'LabTestId', e.target.value)}>
                    <option value="">Select Lab Test...</option>
                    {labTests.map(l => <option key={l.LabTestId} value={l.LabTestId}>{l.TestName}</option>)}
                  </select>
                </div>
                <div style={{ flex: 2 }}>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Remarks (Optional)</label>
                  <input type="text" className="input-field" placeholder="Any specific instructions..." value={test.Remarks} onChange={(e) => updateLabTest(index, 'Remarks', e.target.value)} />
                </div>
                <button onClick={() => removeLabTest(index)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', marginTop: '1.5rem', padding: '0.5rem' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '260px', right: 0, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', padding: '1rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', zIndex: 100 }}>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', padding: '0.75rem 2rem' }}>
          <CheckCircle size={20} /> {loading ? 'Saving...' : 'Submit & Complete Consultation'}
        </button>
      </div>
    </div>
  );
};

export default ConsultationWorkspace;
