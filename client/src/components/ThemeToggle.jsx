import { MoonStar, SunMedium } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ThemeToggle() {
  const { theme, setTheme } = useApp();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/20"
    >
      {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
