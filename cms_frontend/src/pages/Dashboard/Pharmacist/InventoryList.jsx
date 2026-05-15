import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import api from '../../../api/axios';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/pharmacist/inventory/');
      setInventory(response.data);
    } catch (error) {
      console.error('Failed to fetch inventory', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.MedicineName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>Pharmacy Inventory</h2>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search medicine..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary" onClick={() => navigate('new')}>
            <Plus size={18} /> Add Medicine
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Medicine Name</th>
                <th>Stock In Hand</th>
                <th>Re-Order Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const isLowStock = item.StockInHand <= item.ReOrderLevel;
                  return (
                    <tr key={item.MedicineStockId} className={!item.IsActive ? 'inactive-row' : ''}>
                      <td>#{item.MedicineStockId}</td>
                      <td className="font-medium">{item.MedicineName}</td>
                      <td style={{ color: isLowStock ? 'var(--danger)' : 'inherit', fontWeight: isLowStock ? 'bold' : 'normal' }}>
                        {item.StockInHand}
                      </td>
                      <td>{item.ReOrderLevel}</td>
                      <td>
                        {isLowStock ? (
                          <span className="badge" style={{ background: '#fef2f2', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                            <AlertTriangle size={14} /> Low Stock
                          </span>
                        ) : (
                          <span className="badge">In Stock</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No inventory found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
