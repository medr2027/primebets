import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { pushToast } = useApp();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const validation = useMemo(() => {
    if (!form.confirmPassword) return '';
    return form.password === form.confirmPassword ? 'Passwords match' : 'Passwords do not match';
  }, [form.password, form.confirmPassword]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      pushToast({ type: 'error', title: 'Validation error', message: 'Passwords must match.' });
      return;
    }

    setSubmitting(true);
    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      pushToast({ title: 'Account created', message: 'Your local demo account is ready.' });
      navigate('/app/dashboard');
    } catch (error) {
      pushToast({ type: 'error', title: 'Registration failed', message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">PrimeBets</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Create account</h1>
        <p className="mt-2 text-slate-400">Set up a local-only profile to explore the demo platform.</p>

        <div className="mt-8 space-y-4">
          <label className="form-field">
            <span>Username</span>
            <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
          </label>
          <label className="form-field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </label>
          <label className="form-field">
            <span>Confirm password</span>
            <input type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} required />
          </label>
        </div>

        {validation ? (
          <p className={`mt-3 text-sm ${validation.includes('not') ? 'text-rose-300' : 'text-emerald-300'}`}>
            {validation}
          </p>
        ) : null}

        <button type="submit" disabled={submitting} className="button-primary mt-8 w-full justify-center">
          {submitting ? 'Creating account...' : 'Create account'}
        </button>

        <p className="mt-6 text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-emerald-300">Login</Link>
        </p>
      </form>
    </div>
  );
}
