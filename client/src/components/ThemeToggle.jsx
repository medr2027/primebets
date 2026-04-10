import { MoonStar, SunMedium } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

export function ThemeToggle() {
  const { theme, setTheme } = useApp();
  const { token, settings, user, updateAuth } = useAuth();

  async function handleToggle() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    if (!token || !settings) return;

    try {
      const response = await apiRequest('/settings', {
        method: 'PUT',
        token,
        body: JSON.stringify({
          ...settings,
          theme: nextTheme,
        }),
      });
      updateAuth(user, response.settings);
    } catch (_error) {
      setTheme(theme);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="control-chip font-medium"
    >
      {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
