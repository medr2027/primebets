import { useState } from 'react';
import { Bell, Palette, Languages, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { apiRequest } from '../lib/api';

export function SettingsPage() {
  const { settings, token, updateAuth, user } = useAuth();
  const { setTheme, setLanguage, pushToast } = useApp();
  const [form, setForm] = useState({
    language: settings?.language || 'en',
    theme: settings?.theme || 'dark',
    notifications: Boolean(settings?.notifications ?? true),
    compact_mode: Boolean(settings?.compact_mode ?? false),
    odds_format: settings?.odds_format || 'decimal',
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const data = await apiRequest('/settings', {
        method: 'PUT',
        token,
        body: JSON.stringify(form),
      });
      setTheme(data.settings.theme);
      setLanguage(data.settings.language);
      updateAuth(user, data.settings);
      pushToast({ title: 'Settings updated', message: 'Local preferences were saved to SQLite.' });
    } catch (error) {
      pushToast({ type: 'error', title: 'Update failed', message: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass-card rounded-[2rem] p-6">
        <div className="flex items-center gap-3">
          <Languages className="h-5 w-5 text-cyan-300" />
          <h2 className="text-xl font-semibold text-white">Language</h2>
        </div>
        <select value={form.language} onChange={(event) => setForm({ ...form, language: event.target.value })} className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
          <option value="en" className="text-slate-900">English</option>
          <option value="fr" className="text-slate-900">Francais</option>
          <option value="ar" className="text-slate-900">Arabic</option>
        </select>
      </div>

      <div className="glass-card rounded-[2rem] p-6">
        <div className="flex items-center gap-3">
          <Palette className="h-5 w-5 text-emerald-300" />
          <h2 className="text-xl font-semibold text-white">Appearance</h2>
        </div>
        <div className="mt-6 flex gap-4">
          {['dark', 'light'].map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => setForm({ ...form, theme: choice })}
              className={`flex-1 rounded-2xl border px-4 py-3 capitalize transition ${
                form.theme === choice ? 'border-emerald-400 bg-emerald-500/10 text-white' : 'border-white/10 bg-white/5 text-slate-300'
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-6">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-amber-300" />
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
        </div>
        <label className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
          Enable UI notifications
          <input type="checkbox" checked={form.notifications} onChange={(event) => setForm({ ...form, notifications: event.target.checked })} />
        </label>
      </div>

      <div className="glass-card rounded-[2rem] p-6">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-5 w-5 text-rose-300" />
          <h2 className="text-xl font-semibold text-white">UI Preferences</h2>
        </div>
        <label className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
          Compact mode
          <input type="checkbox" checked={form.compact_mode} onChange={(event) => setForm({ ...form, compact_mode: event.target.checked })} />
        </label>
        <label className="mt-4 block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
          Odds format
          <select value={form.odds_format} onChange={(event) => setForm({ ...form, odds_format: event.target.value })} className="mt-3 w-full bg-transparent outline-none">
            <option value="decimal" className="text-slate-900">Decimal</option>
            <option value="fractional" className="text-slate-900">Fractional</option>
          </select>
        </label>
      </div>

      <div className="lg:col-span-2">
        <button type="button" onClick={handleSave} className="button-primary" disabled={saving}>
          {saving ? 'Saving preferences...' : 'Save settings'}
        </button>
      </div>
    </div>
  );
}
