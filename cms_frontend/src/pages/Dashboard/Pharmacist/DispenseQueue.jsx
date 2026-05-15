import React, { useState, useEffect } from 'react';
import { Package, CheckCircle } from 'lucide-react';
import api from '../../../api/axios';

const DispenseQueue = () => {
  const [loading, setLoading] = useState(true);
  const [dispenseQueue, setDispenseQueue] = useState([]);
  const [inventory, setInventory] = useState([]);
  
  // Local state to track quantities being dispensed right now
  const [dispenseQuantities, setDispenseQuantities] = useState({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchQueueData();
  }, []);

  const fetchQueueData = async () => {
    try {
      setLoading(true);
      // 1. Fetch active prescriptions, all appointments, and full inventory
      const [presRes, apptRes, invRes] = await Promise.all([
        api.get('/prescriptions/medicine/'),
        api.get('/appointments/'),
        api.get('/pharmacist/inventory/')
      ]);

      const activePrescriptions = presRes.data.filter(p => p.IsActive);
      setInventory(invRes.data);

      // 2. Group prescriptions by AppointmentId
      const grouped = {};
      activePrescriptions.forEach(p => {
        if (!grouped[p.AppointmentId]) {
          const appt = apptRes.data.find(a => a.AppointmentId === p.AppointmentId);
          grouped[p.AppointmentId] = {
            appointment: appt || { PatientName: 'Unknown', TokenNumber: 'N/A', AppointmentId: p.AppointmentId },
            prescriptions: []
          };
        }
        grouped[p.AppointmentId].prescriptions.push(p);
      });

      setDispenseQueue(Object.values(grouped));
    } catch (error) {
      console.error('Failed to fetch dispense queue', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (prescriptionId, value) => {
    setDispenseQuantities(prev => ({ ...prev, [prescriptionId]: value }));
  };

  const handleDispenseItem = async (prescription) => {
    const qty = parseInt(dispenseQuantities[prescription.MedicinePrescriptionId] || 0);
    if (qty <= 0) {
      alert("Please enter a valid quantity to dispense.");
      return;
    }

    // Find the MedicineStockId for this Medicine
    const stockItem = inventory.find(i => i.MedicineId === prescription.MedicineId);
    if (!stockItem) {
      alert("Error: This medicine does not exist in the inventory database.");
      return;
    }

    if (stockItem.StockInHand < qty) {
      alert(`Insufficient stock! Only ${stockItem.StockInHand} available.`);
      return;
    }

    setProcessing(true);
    try {
      // 1. Hit the custom backend dispense endpoint to reduce stock safely
      await api.post(`/pharmacist/inventory/${stockItem.MedicineStockId}/dispense/`, {
        quantity: qty,
        prescriptionId: prescription.MedicinePrescriptionId
      });

      // 2. Deactivate the prescription so it leaves the queue
      await api.patch(`/prescriptions/medicine/${prescription.MedicinePrescriptionId}/`, {
        IsActive: false
      });

      // Refresh the queue and inventory
      await fetchQueueData();
      alert(`Successfully dispensed ${qty} unit(s) of ${prescription.MedicineName}`);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to dispense medicine.");
    } finally {
      setProcessing(false);
      setDispenseQuantities(prev => ({ ...prev, [prescription.MedicinePrescriptionId]: '' }));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Prescription Dispense Queue</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Process pending prescriptions from doctor consultations.</p>
      </div>

      {loading ? (
        <p>Loading queue...</p>
      ) : dispenseQueue.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Package size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>The dispense queue is currently empty.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {dispenseQueue.map((group) => (
            <div key={group.appointment.AppointmentId} className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--primary)' }}>{group.appointment.PatientName}</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Token: #{group.appointment.TokenNumber}</p>
                </div>
                <span className="badge" style={{ alignSelf: 'flex-start' }}>Waiting</span>
              </div>

              <table className="data-table" style={{ marginTop: 0 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '0.5rem 1rem' }}>Medicine</th>
                    <th style={{ padding: '0.5rem 1rem' }}>Dosage & Freq</th>
                    <th style={{ padding: '0.5rem 1rem' }}>Duration</th>
                    <th style={{ padding: '0.5rem 1rem', width: '120px' }}>Dispense Qty</th>
                    <th style={{ padding: '0.5rem 1rem', width: '100px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {group.prescriptions.map(p => (
                    <tr key={p.MedicinePrescriptionId}>
                      <td className="font-medium" style={{ padding: '0.75rem 1rem' }}>{p.MedicineName}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{p.Dosage} ({p.Frequency})</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{p.Duration}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <input 
                          type="number" 
                          min="1"
                          className="input-field" 
                          style={{ padding: '0.25rem', marginBottom: 0 }}
                          value={dispenseQuantities[p.MedicinePrescriptionId] || ''}
                          onChange={(e) => handleQuantityChange(p.MedicinePrescriptionId, e.target.value)}
                        />
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}
                          onClick={() => handleDispenseItem(p)}
                          disabled={processing || !dispenseQuantities[p.MedicinePrescriptionId]}
                        >
                          <CheckCircle size={14} /> Dispense
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

export default DispenseQueue;
