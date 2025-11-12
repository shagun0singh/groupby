import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    navigate('/login', { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-eyebrow">Dashboard</div>
        <h1 className="auth-title" style={{ marginBottom: '0.5rem' }}>
          Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
        </h1>
        <p className="auth-subtitle" style={{ marginBottom: '2.5rem' }}>
          You are securely signed in. Use the navigation in your main application to explore the platform.
        </p>
        <div className="auth-alert" style={{ background: '#eef2ff', color: '#3730a3' }}>
          <strong>Status:</strong> Authenticated as{' '}
          <span style={{ fontWeight: 600 }}>{user?.email || 'unknown user'}</span>
        </div>
        <button
          type="button"
          className="auth-button"
          style={{ marginTop: '2rem' }}
          onClick={handleLogout}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
