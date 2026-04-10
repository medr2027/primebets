import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Globe2, Trophy } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

const features = [
  { title: 'Local-first stack', text: 'React, Express, and SQLite configured for localhost-only demos.' },
  { title: 'Premium betting UI', text: 'Glass cards, live panels, rich tables, and scalable layout patterns.' },
  { title: 'Extendable architecture', text: 'Structured folders, reusable components, and API-driven screens.' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-app-gradient px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">PrimeBets</p>
            <h1 className="mt-2 text-2xl font-semibold">Sports Demo Platform</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link className="button-secondary" to="/login">Login</Link>
            <Link className="button-primary" to="/register">Register</Link>
          </div>
        </header>

        <section className="grid gap-10 py-20 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              Localhost-only sports betting style demo
            </div>
            <h2 className="mt-8 max-w-3xl text-5xl font-semibold leading-tight md:text-6xl">
              Modern sports product UI built for testing, pitching, and rapid iteration.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Explore a polished dashboard, multi-language interface, fake auth flow, and locally stored betting data without touching any external service.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className="button-primary" to="/register">
                Start Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="button-secondary" to="/login">Access Demo Account</Link>
              <Link className="button-secondary" to="/app/games-3d">View 3D Games</Link>
            </div>
          </div>

          <div className="glass-card fx-mesh fx-glow relative overflow-hidden rounded-[2rem] p-6 shadow-glow">
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="relative space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Live Event Pulse</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Barcelona vs Arsenal</p>
                    <p className="text-sm text-emerald-300">Live odds updating locally</p>
                  </div>
                  <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs text-rose-200">Live</span>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <Zap className="h-6 w-6 text-amber-300" />
                  <p className="mt-3 font-semibold">Fast prototyping</p>
                  <p className="mt-2 text-sm text-slate-400">Seeded data, reusable cards, instant local iteration.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <Globe2 className="h-6 w-6 text-cyan-300" />
                  <p className="mt-3 font-semibold">EN / FR / AR ready</p>
                  <p className="mt-2 text-sm text-slate-400">Language switching and RTL support are built in.</p>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-emerald-300" />
                  <div>
                    <p className="font-semibold">Sports Categories</p>
                    <p className="text-sm text-slate-400">Football, Basketball, Tennis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="glass-card rounded-[2rem] p-6">
              <p className="text-lg font-semibold">{feature.title}</p>
              <p className="mt-3 text-slate-300">{feature.text}</p>
            </article>
          ))}
        </section>

        <footer className="mt-20 border-t border-white/10 py-8 text-sm text-slate-400">
          PrimeBets demo is built for local UI and UX exploration only. No real wagering or external integrations.
        </footer>
      </div>
    </div>
  );
}
