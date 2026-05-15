import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles/');
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to fetch roles', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="table-header">
        <h2>System Roles</h2>
        <p style={{ color: 'var(--text-muted)' }}>Roles are managed by the database administrator.</p>
      </div>

      {loading ? (
        <p>Loading roles...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Role ID</th>
                <th>Role Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {roles.length > 0 ? (
                roles.map((role) => (
                  <tr key={role.RoleId}>
                    <td>#{role.RoleId}</td>
                    <td className="font-medium">{role.RoleName}</td>
                    <td>
                      <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Active</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No roles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RolesList;
