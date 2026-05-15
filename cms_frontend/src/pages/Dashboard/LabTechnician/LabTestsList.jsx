import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../../../api/axios';

const LabTestsList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get('/labtests/list/');
        setTests(response.data);
      } catch (error) {
        console.error('Failed to fetch lab tests', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const filteredTests = tests.filter(test => 
    test.TestName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>Available Lab Tests Reference</h2>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search tests..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading reference data...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Min Range</th>
                <th>Max Range</th>
                <th>Sample Required</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => (
                  <tr key={test.LabTestId}>
                    <td className="font-medium" style={{ color: '#8b5cf6' }}>{test.TestName}</td>
                    <td>{test.ReferenceMinRange}</td>
                    <td>{test.ReferenceMaxRange}</td>
                    <td><span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>{test.SampleRequired}</span></td>
                    <td><span className="badge">Active</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No lab tests found in dictionary.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LabTestsList;
