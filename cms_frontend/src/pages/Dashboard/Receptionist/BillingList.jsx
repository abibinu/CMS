import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText } from 'lucide-react';
import api from '../../../api/axios';

const BillingList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await api.get('/billing/');
      setBills(response.data);
    } catch (error) {
      console.error('Failed to fetch bills', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = bills.filter(b => 
    b.PatientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>Consultation Billing</h2>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by patient..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary" onClick={() => navigate('new')}>
            <Plus size={18} /> Generate Bill
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading billing data...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bill #</th>
                <th>Date</th>
                <th>Patient</th>
                <th>Consultation Fee</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <tr key={bill.BillId}>
                    <td>#{bill.BillId}</td>
                    <td>{new Date(bill.BillDate).toLocaleDateString()}</td>
                    <td className="font-medium">{bill.PatientName}</td>
                    <td>₹{bill.ConsultationFee}</td>
                    <td className="font-medium" style={{color: 'var(--success)'}}>₹{bill.TotalAmount}</td>
                    <td className="actions-cell">
                      <button 
                        className="icon-btn edit-btn" 
                        title="View Receipt"
                        onClick={() => alert(`Printing Bill #${bill.BillId}...\nTotal: ₹${bill.TotalAmount}`)}
                      >
                        <FileText size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No bills found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BillingList;
