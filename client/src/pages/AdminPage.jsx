import { useFetch } from '../hooks/useFetch';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export function AdminPage() {
  const { data, loading } = useFetch('/admin');

  if (loading || !data) {
    return <LoadingSkeleton className="h-[26rem]" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card rounded-[2rem] p-6">
          <p className="text-sm text-slate-400">Users</p>
          <p className="mt-2 text-4xl font-semibold text-white">{data.stats.users}</p>
        </div>
        <div className="glass-card rounded-[2rem] p-6">
          <p className="text-sm text-slate-400">Bets</p>
          <p className="mt-2 text-4xl font-semibold text-white">{data.stats.bets}</p>
        </div>
        <div className="glass-card rounded-[2rem] p-6">
          <p className="text-sm text-slate-400">Matches</p>
          <p className="mt-2 text-4xl font-semibold text-white">{data.stats.matches}</p>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Activity Table</h2>
          <button type="button" className="button-primary">Add match</button>
        </div>

        <div className="mt-6 overflow-auto">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="pb-4">User</th>
                <th className="pb-4">Event</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.activity.map((entry) => (
                <tr key={entry.id} className="border-t border-white/10">
                  <td className="py-4">{entry.username}</td>
                  <td className="py-4">{entry.team1} vs {entry.team2}</td>
                  <td className="py-4">${entry.amount}</td>
                  <td className="py-4 capitalize">{entry.status}</td>
                  <td className="py-4">{new Date(entry.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
