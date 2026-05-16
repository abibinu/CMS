import React, { useState } from 'react';
import { Search, FileText, Pill, Microscope } from 'lucide-react';
import api from '../../../api/axios';

const PatientHistory = () => {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [history, setHistory] = useState({ consultations: [], medicines: [], labTests: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = async (e) => {
    e.preventDefault();
    if (!patientId) return;
    
    setLoading(true);
    setError('');
    setPatientData(null);

    try {
      // Fetch Patient Details first
      const patientRes = await api.get(`/patients/${patientId}/`);
      setPatientData(patientRes.data);

      // Fetch all historical data concurrently
      const [consultsRes, medsRes, labsRes] = await Promise.all([
        api.get(`/consultations/?patientId=${patientId}`).catch(() => ({ data: [] })),
        api.get(`/prescriptions/medicine/?patientId=${patientId}`).catch(() => ({ data: [] })),
        api.get(`/prescriptions/labtest/?patientId=${patientId}`).catch(() => ({ data: [] }))
      ]);

      setHistory({
        consultations: consultsRes.data,
        medicines: medsRes.data,
        labTests: labsRes.data
      });

    } catch (err) {
      console.error(err);
      setError('Patient not found or failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Patient Clinical History</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Review past consultations, prescriptions, and lab results.</p>
      </div>

      <form onSubmit={fetchHistory} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="search-bar" style={{ flex: 1, maxWidth: '400px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="number" 
            placeholder="Enter Patient ID (e.g. 1)" 
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="search-input"
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Fetch History'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {patientData && (
        <div>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{patientData.PatientName}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              DOB: {patientData.DateOfBirth} | Gender: {patientData.Gender} | Mobile: {patientData.MobileNumber}
            </p>
          </div>

          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Consultations */}
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6' }}>
                <FileText size={18} /> Past Consultations
              </h4>
              {history.consultations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {history.consultations.map(c => (
                    <div key={c.ConsultationId} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Date: {new Date(c.CreatedDate).toLocaleDateString()}</p>
                      <p style={{ margin: '0 0 0.25rem 0' }}><b>Symptoms:</b> {c.Symptoms}</p>
                      <p style={{ margin: '0 0 0.25rem 0' }}><b>Diagnosis:</b> {c.Diagnosis}</p>
                      <p style={{ margin: 0 }}><b>Notes:</b> {c.Notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No consultation history found.</p>
              )}
            </div>

            <hr style={{ borderTop: '1px solid var(--border)' }} />

            {/* Medicines */}
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                <Pill size={18} /> Medicine Prescriptions
              </h4>
              {history.medicines.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Freq</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.medicines.map(m => (
                      <tr key={m.MedicinePrescriptionId}>
                        <td>{new Date(m.CreatedDate).toLocaleDateString()}</td>
                        <td className="font-medium">{m.MedicineName}</td>
                        <td>{m.Dosage}</td>
                        <td>{m.Frequency}</td>
                        <td>{m.Duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No medicine prescriptions found.</p>
              )}
            </div>

            <hr style={{ borderTop: '1px solid var(--border)' }} />

            {/* Lab Tests */}
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                <Microscope size={18} /> Lab Test Results
              </h4>
              {history.labTests.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Test Name</th>
                      <th>Result Value</th>
                      <th>Lab Remarks</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.labTests.map(l => (
                      <tr key={l.LabTestPrescriptionId}>
                        <td>{new Date(l.CreatedDate).toLocaleDateString()}</td>
                        <td className="font-medium">{l.TestName}</td>
                        <td>{l.LabTestValue || 'Pending'}</td>
                        <td>{l.Remarks || '-'}</td>
                        <td>
                          {l.LabTestValue ? <span className="badge" style={{background: '#dcfce7', color: '#166534'}}>Completed</span> : <span className="badge">Pending</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No lab tests found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
