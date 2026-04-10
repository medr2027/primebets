import { Rocket, Dice3, Orbit, Sparkles, TimerReset, Joystick } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const gameTiles = [
  {
    name: 'Crash X',
    subtitle: 'Real-time multiplier climb',
    status: 'Hot',
    accent: 'from-rose-500/30 to-orange-400/20',
    icon: Rocket,
  },
  {
    name: 'Space Dice',
    subtitle: 'Fast rounds with 3D cubes',
    status: 'New',
    accent: 'from-cyan-500/30 to-blue-400/20',
    icon: Dice3,
  },
  {
    name: 'Orbit Rush',
    subtitle: 'Precision timing challenge',
    status: 'Live',
    accent: 'from-violet-500/30 to-fuchsia-400/20',
    icon: Orbit,
  },
  {
    name: 'Neon Mines',
    subtitle: 'Risk-reward tile strategy',
    status: 'Popular',
    accent: 'from-emerald-500/30 to-teal-400/20',
    icon: Sparkles,
  },
  {
    name: 'Turbo Wheel',
    subtitle: 'Quick spin micro-sessions',
    status: 'Live',
    accent: 'from-amber-500/30 to-yellow-400/20',
    icon: TimerReset,
  },
  {
    name: 'Arena Duel',
    subtitle: 'Head-to-head arcade mode',
    status: 'Beta',
    accent: 'from-indigo-500/30 to-sky-400/20',
    icon: Joystick,
  },
];

export function Games3DPage() {
  const [isRoundRunning, setIsRoundRunning] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [bankroll, setBankroll] = useState(500);
  const [stake, setStake] = useState(20);
  const [history, setHistory] = useState([]);
  const [events, setEvents] = useState([]);
  const [velocity, setVelocity] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [roundTime, setRoundTime] = useState(0);
  const [autoCashOut, setAutoCashOut] = useState(2);
  const crashPointRef = useRef(1.8 + Math.random() * 3.2);
  const velocityRef = useRef(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!isRoundRunning) return undefined;

    const timer = window.setInterval(() => {
      setMultiplier((current) => {
        elapsedRef.current += 0.12;
        const drag = Math.max(0.015, current * 0.006);
        velocityRef.current += 0.028 - drag + Math.random() * 0.012;
        const next = Number((current + Math.max(0.02, velocityRef.current)).toFixed(2));
        const nextAltitude = Number((Math.max(0, (next - 1) * 120 + Math.sin(elapsedRef.current * 1.8) * 8)).toFixed(1));
        setAltitude(nextAltitude);
        setVelocity(Number((velocityRef.current * 10).toFixed(2)));
        setRoundTime(Number(elapsedRef.current.toFixed(2)));

        if (next >= Number(autoCashOut) && Number(autoCashOut) > 1.01) {
          const payout = Number((Number(stake || 0) * Number(autoCashOut)).toFixed(2));
          setBankroll((currentBank) => Number((currentBank + payout).toFixed(2)));
          setHistory((currentHistory) => [Number(autoCashOut), ...currentHistory].slice(0, 8));
          setIsRoundRunning(false);
          return 1;
        }

        if (next >= crashPointRef.current) {
          setIsRoundRunning(false);
          setHistory((currentHistory) => [Number(crashPointRef.current.toFixed(2)), ...currentHistory].slice(0, 8));
          setEvents((currentEvents) => [
            {
              id: Date.now(),
              type: 'crash',
              text: `Crashed at ${crashPointRef.current.toFixed(2)}x. Stake lost.`,
            },
            ...currentEvents,
          ].slice(0, 6));
          return 1;
        }
        return next;
      });
    }, 120);

    return () => window.clearInterval(timer);
  }, [isRoundRunning, stake]);

  function startRound() {
    const normalizedStake = Number(stake || 0);
    if (isRoundRunning || normalizedStake <= 0 || normalizedStake > bankroll) return;
    crashPointRef.current = 1.3 + Math.random() * 5.7;
    velocityRef.current = 0.03;
    elapsedRef.current = 0;
    setMultiplier(1);
    setRoundTime(0);
    setAltitude(0);
    setVelocity(0.3);
    setBankroll((current) => Number((current - normalizedStake).toFixed(2)));
    setEvents((current) => [
      {
        id: Date.now(),
        type: 'bet',
        text: `Stake $${normalizedStake.toFixed(2)} armed.`,
      },
      ...current,
    ].slice(0, 6));
    setIsRoundRunning(true);
  }

  function cashOut() {
    if (!isRoundRunning) return;
    const payout = Number((Number(stake || 0) * multiplier).toFixed(2));
    setBankroll((current) => Number((current + payout).toFixed(2)));
    setHistory((currentHistory) => [Number(multiplier.toFixed(2)), ...currentHistory].slice(0, 8));
    setIsRoundRunning(false);
    setMultiplier(1);
    setAltitude(0);
    setVelocity(0);
    setRoundTime(0);
    setEvents((current) => [
      {
        id: Date.now(),
        type: 'win',
        text: `Cashed out at ${multiplier.toFixed(2)}x (+$${(payout - Number(stake || 0)).toFixed(2)}).`,
      },
      ...current,
    ].slice(0, 6));
  }

  return (
    <div className="space-y-8">
      <section className="glass-card relative overflow-hidden rounded-[2rem] p-8">
        <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">3D Arcade Hub</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Crash and many more 3D games</h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Explore a richer game experience with immersive cards, animated highlights, and smooth interactions.
              This page is designed to showcase Crash-style sessions with a premium visual effect system.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="button-primary">Play Crash Demo</button>
              <button type="button" className="button-secondary">Browse All 3D Games</button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Crash simulator pulse</p>
            <div className="mt-4 rounded-2xl border border-rose-400/20 bg-gradient-to-br from-rose-500/20 via-orange-500/10 to-transparent p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-rose-200">Current multiplier</p>
              <p className={`mt-2 text-5xl font-semibold text-white drop-shadow-sm ${isRoundRunning ? 'animate-pulse' : ''}`}>
                {multiplier.toFixed(2)}x
              </p>
              <p className="mt-3 text-sm text-rose-100/90">
                Risk zone: {multiplier < 2 ? 'Low' : multiplier < 4 ? 'Medium' : 'High'}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-slate-400">Players</p>
                <p className="mt-1 text-lg font-semibold text-white">1,842</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-slate-400">Bankroll</p>
                <p className="mt-1 text-lg font-semibold text-white">${bankroll.toFixed(2)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-slate-400">Velocity</p>
                <p className="mt-1 text-lg font-semibold text-white">{velocity.toFixed(2)} u/s</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-slate-400">Altitude</p>
                <p className="mt-1 text-lg font-semibold text-white">{altitude.toFixed(1)} m</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <label className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Stake</p>
                <input
                  type="number"
                  min="1"
                  value={stake}
                  onChange={(event) => setStake(Number(event.target.value))}
                  className="mt-2 w-full bg-transparent text-white outline-none"
                />
              </label>
              <label className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Auto cash-out</p>
                <input
                  type="number"
                  min="1.05"
                  step="0.05"
                  value={autoCashOut}
                  onChange={(event) => setAutoCashOut(Number(event.target.value))}
                  className="mt-2 w-full bg-transparent text-white outline-none"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={startRound} className="button-primary justify-center">Start Round</button>
                <button type="button" onClick={cashOut} className="button-secondary justify-center">Cash Out</button>
              </div>
              <p className="text-xs text-slate-400">Round time: {roundTime.toFixed(2)}s • Crash risk increases with speed and drag.</p>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Recent multipliers</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {history.length === 0 ? <span className="text-sm text-slate-400">No rounds yet</span> : null}
                {history.map((value, index) => (
                  <span key={`${value}-${index}`} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white">
                    {value.toFixed(2)}x
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Round feed</p>
              <div className="mt-2 space-y-2">
                {events.length === 0 ? <p className="text-sm text-slate-400">No events yet</p> : null}
                {events.map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
                    {entry.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-white">Featured 3D Games</h2>
          <span className="rounded-full border border-cyan-300/20 bg-cyan-500/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
            Enhanced Effects
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {gameTiles.map((game) => {
            const Icon = game.icon;
            return (
              <article
                key={game.name}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/55 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-glow"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${game.accent} opacity-70 transition group-hover:opacity-100`} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white">
                      {game.status}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{game.name}</h3>
                  <p className="mt-2 text-sm text-slate-200">{game.subtitle}</p>
                  <button type="button" className="mt-5 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
                    Open Lobby
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
