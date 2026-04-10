import {
  LayoutDashboard,
  Trophy,
  RadioTower,
  ReceiptText,
  History,
  Wallet,
  Gamepad2,
  UserRound,
  Settings,
  Shield,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const menuConfig = (t) => [
  { to: '/app/dashboard', label: t.dashboard, icon: LayoutDashboard },
  { to: '/app/matches', label: t.matches, icon: Trophy },
  { to: '/app/live', label: t.live, icon: RadioTower },
  { to: '/app/my-bets', label: t.myBets, icon: ReceiptText },
  { to: '/app/history', label: t.history, icon: History },
  { to: '/app/wallet', label: t.wallet, icon: Wallet },
  { to: '/app/games-3d', label: t.games3d, icon: Gamepad2 },
  { to: '/app/profile', label: t.profile, icon: UserRound },
  { to: '/app/settings', label: t.settings, icon: Settings },
  { to: '/app/admin', label: t.admin, icon: Shield },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, t } = useApp();
  const items = menuConfig(t);

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm transition md:hidden ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-80 flex-col border-r border-white/10 bg-slate-950/85 p-6 backdrop-blur-xl transition duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">PrimeBets</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Demo Suite</h1>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-full border border-white/10 p-2 text-white md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-glow'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="glass-card rounded-3xl p-4">
          <p className="text-sm text-slate-400">Local demo mode</p>
          <p className="mt-2 text-sm text-white">No external services, all data stays on localhost.</p>
        </div>
      </aside>
    </>
  );
}
