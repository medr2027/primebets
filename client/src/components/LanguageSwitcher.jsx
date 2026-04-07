import { Languages } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useApp();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100">
      <Languages className="h-4 w-4" />
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="bg-transparent outline-none"
      >
        <option value="en" className="text-slate-900">EN</option>
        <option value="fr" className="text-slate-900">FR</option>
        <option value="ar" className="text-slate-900">AR</option>
      </select>
    </div>
  );
}
