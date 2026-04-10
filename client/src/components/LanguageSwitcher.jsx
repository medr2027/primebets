import { Languages } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

export function LanguageSwitcher() {
  const { language, setLanguage } = useApp();
  const { token, settings, user, updateAuth } = useAuth();

  async function handleChange(nextLanguage) {
    setLanguage(nextLanguage);

    if (!token || !settings) return;

    try {
      const response = await apiRequest('/settings', {
        method: 'PUT',
        token,
        body: JSON.stringify({
          ...settings,
          language: nextLanguage,
        }),
      });
      updateAuth(user, response.settings);
    } catch (_error) {
      setLanguage(language);
    }
  }

  return (
    <div className="control-chip">
      <Languages className="h-4 w-4" />
      <select
        value={language}
        onChange={(event) => handleChange(event.target.value)}
        className="pr-1"
      >
        <option value="en" className="text-slate-900">EN</option>
        <option value="fr" className="text-slate-900">FR</option>
        <option value="ar" className="text-slate-900">AR</option>
      </select>
    </div>
  );
}
