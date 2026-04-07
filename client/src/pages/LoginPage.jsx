import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { pushToast } = useApp();
  const [form, setForm] = useState({
    email: 'demo@primebets.local',
    password: 'demo123',
    remember: true,
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await login(form);
      pushToast({ title: 'Welcome back', message: 'Local session restored successfully.' });
      navigate('/app/dashboard');
    } catch (error) {
      pushToast({ type: 'error', title: 'Login failed', message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">PrimeBets</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Welcome back</h1>
        <p className="mt-2 text-slate-400">Sign in to continue into your local betting demo dashboard.</p>

        <div className="mt-8 space-y-4">
          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(event) => setForm({ ...form, remember: event.target.checked })}
            />
            Remember me
          </label>
          <button type="button" className="text-emerald-300">Forgot password?</button>
        </div>

        <button type="submit" disabled={submitting} className="button-primary mt-8 w-full justify-center">
          {submitting ? 'Signing in...' : 'Login'}
        </button>

        <p className="mt-6 text-sm text-slate-400">
          New here? <Link to="/register" className="text-emerald-300">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
