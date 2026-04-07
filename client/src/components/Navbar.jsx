import { Bell, Menu, Search, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { useApp } from '../context/AppContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const { setSidebarOpen, t } = useApp();

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-slate-950/60 px-4 py-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-full border border-white/10 p-2 text-white md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            placeholder={`${t.matches}, ${t.live.toLowerCase()}...`}
            className="bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        <button type="button" className="relative rounded-full border border-white/10 bg-white/10 p-3 text-white">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400" />
        </button>
        <div className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-2 md:block">
          <p className="text-xs text-slate-400">Signed in</p>
          <p className="text-sm font-semibold text-white">{user?.username}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-white/10 bg-white/10 p-3 text-white transition hover:bg-white/20"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
