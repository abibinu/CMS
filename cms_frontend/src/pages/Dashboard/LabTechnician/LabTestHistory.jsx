import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import api from '../../../api/axios';

const LabTestHistory = () => {
  const [loading, setLoading] = useState(true);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      // Fetch completed lab test prescriptions and appointments
      const [historyRes, apptRes] = await Promise.all([
        api.get('/labtests/results/completed/'),
        api.get('/appointments/')
      ]);

      const completedPrescriptions = historyRes.data;

      // Group prescriptions by AppointmentId
      const grouped = {};
      completedPrescriptions.forEach(p => {
        if (!grouped[p.AppointmentId]) {
          const appt = apptRes.data.find(a => a.AppointmentId === p.AppointmentId);
          grouped[p.AppointmentId] = {
            appointment: appt || { PatientName: 'Unknown Patient', TokenNumber: 'N/A', AppointmentId: p.AppointmentId },
            prescriptions: []
          };
        }
        grouped[p.AppointmentId].prescriptions.push(p);
      });

      // Sort by newest first (descending by ID for simplicity)
      const sortedHistory = Object.values(grouped).sort((a, b) => b.appointment.AppointmentId - a.appointment.AppointmentId);

      setHistoryList(sortedHistory);
    } catch (error) {
      console.error('Failed to fetch lab test history', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Lab Test History</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Review completed lab test results.</p>
      </div>

      {loading ? (
        <p>Loading history...</p>
      ) : historyList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FileText size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>There is no lab test history available.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {historyList.map((group) => (
            <div key={group.appointment.AppointmentId} className="card" style={{ borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#10b981' }}>{group.appointment.PatientName}</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Token: #{group.appointment.TokenNumber}</p>
                </div>
                <span className="badge" style={{ alignSelf: 'flex-start', background: '#d1fae5', color: '#047857' }}>Completed</span>
              </div>

              <table className="data-table" style={{ marginTop: 0 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '0.5rem 1rem' }}>Test Name</th>
                    <th style={{ padding: '0.5rem 1rem' }}>Doctor's Remarks</th>
                    <th style={{ padding: '0.5rem 1rem', width: '25%' }}>Test Result Value</th>
                    <th style={{ padding: '0.5rem 1rem', width: '25%' }}>Lab Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {group.prescriptions.map(p => (
                    <tr key={p.LabTestPrescriptionId}>
                      <td className="font-medium" style={{ padding: '0.75rem 1rem' }}>{p.TestName}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{p.Remarks || 'None'}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{p.LabTestValue}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{p.Remarks || '-'}</td>
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

export default LabTestHistory;
