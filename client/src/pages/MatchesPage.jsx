import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { MatchCard } from '../components/MatchCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useFetch } from '../hooks/useFetch';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const categories = ['all', 'Football', 'Basketball', 'Tennis'];
const statuses = ['all', 'live', 'upcoming'];

export function MatchesPage({ liveOnly = false }) {
  const { token } = useAuth();
  const { pushToast } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState(liveOnly ? 'live' : 'all');
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category !== 'all') params.set('category', category);
    if (status !== 'all') params.set('status', status);
    return params.toString();
  }, [search, category, status]);

  const { data, setData, loading } = useFetch(`/matches${query ? `?${query}` : ''}`, {}, [query]);

  async function handleFavorite(matchId) {
    const response = await apiRequest(`/matches/${matchId}/favorite`, {
      method: 'PATCH',
      token,
    });
    setData((current) => ({
      ...current,
      matches: current.matches.map((item) => (item.id === matchId ? response.match : item)),
    }));
  }

  async function handleBet(match, option) {
    await apiRequest('/bets', {
      method: 'POST',
      token,
      body: JSON.stringify({
        matchId: match.id,
        amount: 15,
        odd: option.value,
        selection: option.key,
      }),
    });
    pushToast({
      title: 'Bet placed locally',
      message: `${match.team1} vs ${match.team2} added to dummy history.`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-[2rem] p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search teams or leagues"
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="bg-transparent outline-none">
              {categories.map((item) => <option key={item} value={item} className="text-slate-900">{item}</option>)}
            </select>
          </label>
          <label className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="bg-transparent outline-none">
              {statuses.map((item) => <option key={item} value={item} className="text-slate-900">{item}</option>)}
            </select>
          </label>
        </div>
      </div>

      {loading || !data ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <LoadingSkeleton key={index} className="h-72" />)}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {data.matches.map((match) => <MatchCard key={match.id} match={match} onFavorite={handleFavorite} onBet={handleBet} />)}
        </div>
      )}
    </div>
  );
}
