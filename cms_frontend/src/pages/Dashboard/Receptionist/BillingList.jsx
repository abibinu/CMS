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

  const handlePrint = (bill) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Bill</title>');
    printWindow.document.write('<style>body{font-family:sans-serif;padding:2rem;} .bill-header{text-align:center;border-bottom:2px solid #ccc;padding-bottom:1rem;margin-bottom:2rem;} .row{display:flex;justify-content:space-between;margin-bottom:0.5rem;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="bill-header"><h2>MacFast CMS Clinic</h2><p>Official Consultation Receipt</p></div>');
    printWindow.document.write(`<div class="row"><b>Bill #:</b> ${bill.BillId}</div>`);
    printWindow.document.write(`<div class="row"><b>Date:</b> ${new Date(bill.BillDate).toLocaleDateString()}</div>`);
    printWindow.document.write(`<div class="row"><b>Patient:</b> ${bill.PatientName}</div>`);
    printWindow.document.write('<hr style="margin:1.5rem 0;border:none;border-top:1px dashed #ccc;" />');
    printWindow.document.write(`<div class="row"><span>Consultation Fee:</span> <span>₹${bill.ConsultationFee}</span></div>`);
    printWindow.document.write(`<div class="row"><span>Registration Charge:</span> <span>₹${bill.RegistrationCharge}</span></div>`);
    printWindow.document.write(`<div class="row"><span>Additional Charges:</span> <span>₹${bill.AdditionalCharges}</span></div>`);
    printWindow.document.write('<hr style="margin:1.5rem 0;border:none;border-top:1px solid #000;" />');
    printWindow.document.write(`<div class="row" style="font-size:1.2rem;"><b>Total Amount:</b> <b>₹${bill.TotalAmount}</b></div>`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

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
                        title="Edit Bill"
                        onClick={() => navigate('edit', { state: { bill } })}
                        style={{ marginRight: '0.5rem' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button 
                        className="icon-btn" 
                        title="View Receipt"
                        onClick={() => handlePrint(bill)}
                        style={{ background: '#f1f5f9', color: '#475569' }}
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
