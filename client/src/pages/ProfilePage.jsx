import { useState } from 'react';
import { CalendarRange, Mail, PencilLine, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { apiRequest } from '../lib/api';

export function ProfilePage() {
  const { user, token, updateAuth, settings } = useAuth();
  const { pushToast } = useApp();
  const [form, setForm] = useState({
    username: user.username,
    email: user.email,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const data = await apiRequest('/auth/profile', {
        method: 'PUT',
        token,
        body: JSON.stringify(form),
      });
      updateAuth(data.user, settings);
      pushToast({ title: 'Profile saved', message: 'Your local profile was updated.' });
    } catch (error) {
      pushToast({ type: 'error', title: 'Save failed', message: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-card rounded-[2rem] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-2xl font-semibold text-white">
            {user.username.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">{user.username}</h2>
            <p className="text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-sm text-slate-300">
          <div className="flex items-center gap-3"><UserRound className="h-4 w-4 text-emerald-300" />Standard local demo account</div>
          <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-cyan-300" />Verified locally only</div>
          <div className="flex items-center gap-3"><CalendarRange className="h-4 w-4 text-amber-300" />Joined {new Date(user.created_at).toLocaleDateString()}</div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Balance</p>
            <p className="mt-2 text-2xl font-semibold text-white">${Number(user.balance).toFixed(2)}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Tier</p>
            <p className="mt-2 text-2xl font-semibold text-white">Silver</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Preferences</p>
            <p className="mt-2 text-2xl font-semibold text-white">{settings?.language?.toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-6">
        <div className="flex items-center gap-3">
          <PencilLine className="h-5 w-5 text-emerald-300" />
          <h2 className="text-xl font-semibold text-white">Edit profile</h2>
        </div>

        <div className="mt-6 space-y-4">
          <label className="form-field">
            <span>Username</span>
            <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          </label>
          <label className="form-field">
            <span>Email</span>
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <button type="button" onClick={handleSave} className="button-primary mt-4" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
