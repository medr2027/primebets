import { Star } from 'lucide-react';

function getTeamStyle(team) {
  const palette = [
    'from-emerald-500 to-cyan-500',
    'from-rose-500 to-orange-500',
    'from-violet-500 to-fuchsia-500',
    'from-indigo-500 to-sky-500',
    'from-amber-500 to-yellow-500',
  ];
  const index = team.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % palette.length;
  return palette[index];
}

function TeamBadge({ name }) {
  const short = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${getTeamStyle(name)} text-xs font-bold text-white`}>
      {short}
    </span>
  );
}

export function MatchCard({ match, onFavorite, onBet }) {
  return (
    <div className="glass-card group rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">{match.league}</p>
          <div className="mt-2 flex items-center gap-2 text-white">
            <TeamBadge name={match.team1} />
            <h3 className="text-lg font-semibold">
              {match.team1} <span className="text-slate-500">vs</span> {match.team2}
            </h3>
            <TeamBadge name={match.team2} />
          </div>
          <p className="mt-2 text-sm text-slate-400">{new Date(match.start_time).toLocaleString()}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-200">{match.category}</p>
        </div>
        <button
          type="button"
          onClick={() => onFavorite(match.id)}
          className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-amber-400 hover:text-amber-300"
        >
          <Star className={`h-4 w-4 ${match.is_favorite ? 'fill-amber-400 text-amber-300' : ''}`} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { key: '1', value: match.odds1 },
          { key: 'X', value: match.oddsX },
          { key: '2', value: match.odds2 },
        ].map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onBet(match, option)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-400/60 hover:bg-emerald-500/15"
          >
            <span className="block text-xs text-slate-400">{option.key}</span>
            {option.value}
          </button>
        ))}
      </div>
    </div>
  );
}
