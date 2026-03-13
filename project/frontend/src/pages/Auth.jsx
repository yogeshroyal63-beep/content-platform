import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.backdrop} />
      <div className={styles.card + ' fade-in'}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>◈</span>
          <span className={styles.logoText}>ContentHub</span>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${mode === 'login' ? styles.active : ''}`} onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
          <button className={`${styles.tab} ${mode === 'register' ? styles.active : ''}`} onClick={() => { setMode('register'); setError(''); }}>Create Account</button>
        </div>

        <form onSubmit={submit} className={styles.form}>
          {mode === 'register' && (
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <input name="username" value={form.username} onChange={handle} placeholder="your_handle" required minLength={3} className={styles.input} />
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required className={styles.input} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'} required minLength={6} className={styles.input} />
          </div>

          {error && <div className={styles.error}><span>⚠</span> {error}</div>}

          <button type="submit" disabled={loading} className={`btn btn-primary ${styles.submitBtn}`}>
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {mode === 'login' && (
          <p className={styles.hint}>
            Demo: <code>demo@example.com</code> / <code>password123</code>
          </p>
        )}
      </div>
    </div>
  );
}
