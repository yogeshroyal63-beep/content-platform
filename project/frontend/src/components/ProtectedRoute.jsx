import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16 }}>
        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        <span style={{ color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif' }}>Loading…</span>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
