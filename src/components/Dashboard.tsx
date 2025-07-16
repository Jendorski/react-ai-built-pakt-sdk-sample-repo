import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Welcome to PAKT Dashboard</h1>
        <p>Hello, {user?.firstName || 'User'}!</p>
        <div style={{ marginBottom: '20px' }}>
          <strong>User Information:</strong>
          <div>Email: {user?.email}</div>
          <div>Username: {user?.userName}</div>
          <div>Name: {user?.firstName} {user?.lastName}</div>
        </div>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;