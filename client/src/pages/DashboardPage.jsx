import { DollarSign, Flame, Star, Ticket } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { MatchCard } from '../components/MatchCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useFetch } from '../hooks/useFetch';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export function DashboardPage() {
  const { token } = useAuth();
  const { pushToast, t } = useApp();
  const { data, setData, loading } = useFetch('/dashboard');

  async function handleFavorite(matchId) {
    const response = await apiRequest(`/matches/${matchId}/favorite`, {
      method: 'PATCH',
      token,
    });

    setData((current) => ({
      ...current,
      liveMatches: current.liveMatches.map((item) => (item.id === matchId ? response.match : item)),
      upcomingMatches: current.upcomingMatches.map((item) => (item.id === matchId ? response.match : item)),
      favorites: response.match.is_favorite
        ? [response.match, ...current.favorites.filter((item) => item.id !== matchId)]
        : current.favorites.filter((item) => item.id !== matchId),
    }));
  }

  async function handleBet(match, option) {
    await apiRequest('/bets', {
      method: 'POST',
      token,
      body: JSON.stringify({
        matchId: match.id,
        amount: 25,
        odd: option.value,
        selection: option.key,
      }),
    });

    pushToast({
      title: 'Bet ticket added',
      message: `${match.team1} vs ${match.team2} (${option.key}) added with dummy data.`,
    });
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <LoadingSkeleton key={index} className="h-32" />)}
        </div>
        <LoadingSkeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Balance" value={`$${Number(data.summary.balance).toFixed(2)}`} accent="bg-emerald-400" />
        <StatCard label="Active Bets" value={data.summary.activeBets} accent="bg-cyan-400" />
        <StatCard label="Wins" value={data.summary.wins} accent="bg-amber-400" />
        <StatCard label="Losses" value={data.summary.losses} accent="bg-rose-400" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Flame className="h-5 w-5 text-rose-300" />
              <h2 className="text-xl font-semibold text-white">{t.liveMatches}</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {data.liveMatches.map((match) => <MatchCard key={match.id} match={match} onFavorite={handleFavorite} onBet={handleBet} />)}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-3">
              <Star className="h-5 w-5 text-amber-300" />
              <h2 className="text-xl font-semibold text-white">{t.favoriteMatches}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {data.favorites.map((match) => <MatchCard key={match.id} match={match} onFavorite={handleFavorite} onBet={handleBet} />)}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-[2rem] p-6">
            <div className="flex items-center gap-3">
              <Ticket className="h-5 w-5 text-emerald-300" />
              <h2 className="text-xl font-semibold text-white">{t.quickBet}</h2>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Slip preview</p>
                <p className="mt-2 text-white">Use any odds tile to add a local dummy bet instantly.</p>
              </div>
              <button type="button" className="button-primary w-full justify-center">Add Fast Wager</button>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6">
            <div className="mb-4 flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-cyan-300" />
              <h2 className="text-xl font-semibold text-white">{t.recentActivity}</h2>
            </div>
            <div className="space-y-3">
              {data.activity.map((entry) => (
                <div key={entry.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-white">{entry.team1} vs {entry.team2}</p>
                  <p className="mt-1 text-sm text-slate-400">{entry.selection} • ${entry.amount} • {entry.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <Ticket className="h-5 w-5 text-cyan-300" />
          <h2 className="text-xl font-semibold text-white">{t.upcomingMatches}</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {data.upcomingMatches.slice(0, 6).map((match) => <MatchCard key={match.id} match={match} onFavorite={handleFavorite} onBet={handleBet} />)}
        </div>
      </section>
    </div>
  );
}
