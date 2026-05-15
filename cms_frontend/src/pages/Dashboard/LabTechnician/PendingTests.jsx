import React, { useState, useEffect } from 'react';
import { Microscope, CheckCircle } from 'lucide-react';
import api from '../../../api/axios';

const PendingTests = () => {
  const [loading, setLoading] = useState(true);
  const [pendingQueue, setPendingQueue] = useState([]);
  
  // Local state to track test results being entered
  const [testResults, setTestResults] = useState({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchQueueData();
  }, []);

  const fetchQueueData = async () => {
    try {
      setLoading(true);
      // 1. Fetch active lab test prescriptions and appointments
      const [presRes, apptRes] = await Promise.all([
        api.get('/labtests/results/'),
        api.get('/appointments/')
      ]);

      const activePrescriptions = presRes.data.filter(p => p.IsActive);

      // 2. Group prescriptions by AppointmentId
      const grouped = {};
      activePrescriptions.forEach(p => {
        if (!grouped[p.AppointmentId]) {
          const appt = apptRes.data.find(a => a.AppointmentId === p.AppointmentId);
          grouped[p.AppointmentId] = {
            appointment: appt || { PatientName: 'Unknown Patient', TokenNumber: 'N/A', AppointmentId: p.AppointmentId },
            prescriptions: []
          };
        }
        grouped[p.AppointmentId].prescriptions.push(p);
      });

      setPendingQueue(Object.values(grouped));
    } catch (error) {
      console.error('Failed to fetch pending lab tests', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultChange = (prescriptionId, field, value) => {
    setTestResults(prev => ({
      ...prev,
      [prescriptionId]: {
        ...prev[prescriptionId],
        [field]: value
      }
    }));
  };

  const handleSaveResult = async (prescription) => {
    const resultData = testResults[prescription.LabTestPrescriptionId];
    
    if (!resultData?.LabTestValue) {
      alert("Please enter a Lab Test Value before saving.");
      return;
    }

    setProcessing(true);
    try {
      // 1. Save the quantitative/qualitative result
      await api.put(`/labtests/results/${prescription.LabTestPrescriptionId}/`, {
        LabTestValue: resultData.LabTestValue,
        Remarks: resultData.Remarks || ''
      });

      // 2. Deactivate the prescription so it leaves the queue
      await api.patch(`/labtests/${prescription.LabTestPrescriptionId}/deactivate/`);

      // Refresh the queue
      await fetchQueueData();
      alert(`Successfully recorded result for ${prescription.TestName}`);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save lab test result.");
    } finally {
      setProcessing(false);
      // Clear local state for this ID
      const newResults = { ...testResults };
      delete newResults[prescription.LabTestPrescriptionId];
      setTestResults(newResults);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Pending Lab Tests</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Record results for tests requested by the doctor.</p>
      </div>

      {loading ? (
        <p>Loading queue...</p>
      ) : pendingQueue.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Microscope size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>There are no pending lab tests in the queue.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {pendingQueue.map((group) => (
            <div key={group.appointment.AppointmentId} className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#8b5cf6' }}>{group.appointment.PatientName}</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Token: #{group.appointment.TokenNumber}</p>
                </div>
                <span className="badge" style={{ alignSelf: 'flex-start', background: '#ede9fe', color: '#6d28d9' }}>Pending</span>
              </div>

              <table className="data-table" style={{ marginTop: 0 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '0.5rem 1rem' }}>Test Name</th>
                    <th style={{ padding: '0.5rem 1rem' }}>Doctor's Remarks</th>
                    <th style={{ padding: '0.5rem 1rem', width: '25%' }}>Test Result Value <span style={{color:'red'}}>*</span></th>
                    <th style={{ padding: '0.5rem 1rem', width: '25%' }}>Lab Remarks</th>
                    <th style={{ padding: '0.5rem 1rem', width: '100px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {group.prescriptions.map(p => (
                    <tr key={p.LabTestPrescriptionId}>
                      <td className="font-medium" style={{ padding: '0.75rem 1rem' }}>{p.TestName}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{p.Remarks || 'None'}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <input 
                          type="text" 
                          placeholder="e.g. 14.5 g/dL"
                          className="input-field" 
                          style={{ padding: '0.4rem', marginBottom: 0 }}
                          value={testResults[p.LabTestPrescriptionId]?.LabTestValue || ''}
                          onChange={(e) => handleResultChange(p.LabTestPrescriptionId, 'LabTestValue', e.target.value)}
                        />
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <input 
                          type="text" 
                          placeholder="Optional notes..."
                          className="input-field" 
                          style={{ padding: '0.4rem', marginBottom: 0 }}
                          value={testResults[p.LabTestPrescriptionId]?.Remarks || ''}
                          onChange={(e) => handleResultChange(p.LabTestPrescriptionId, 'Remarks', e.target.value)}
                        />
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto', background: '#8b5cf6' }}
                          onClick={() => handleSaveResult(p)}
                          disabled={processing || !testResults[p.LabTestPrescriptionId]?.LabTestValue}
                        >
                          <CheckCircle size={14} /> Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingTests;
