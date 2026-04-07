import { useFetch } from '../hooks/useFetch';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export function BetsHistoryPage() {
  const { data, loading } = useFetch('/bets');

  if (loading || !data) {
    return <LoadingSkeleton className="h-[28rem]" />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <div className="glass-card rounded-[2rem] p-6">
        <h2 className="text-xl font-semibold text-white">Bets History</h2>
        <div className="mt-6 overflow-auto">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="pb-4">Event</th>
                <th className="pb-4">League</th>
                <th className="pb-4">Selection</th>
                <th className="pb-4">Stake</th>
                <th className="pb-4">Odd</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.bets.map((bet) => (
                <tr key={bet.id} className="border-t border-white/10">
                  <td className="py-4">{bet.team1} vs {bet.team2}</td>
                  <td className="py-4">{bet.league}</td>
                  <td className="py-4">{bet.selection}</td>
                  <td className="py-4">${bet.amount}</td>
                  <td className="py-4">{bet.odd}</td>
                  <td className="py-4">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize">{bet.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-6">
        <h2 className="text-xl font-semibold text-white">Transactions</h2>
        <div className="mt-6 space-y-3">
          {data.transactions.map((transaction) => (
            <div key={transaction.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="font-medium capitalize text-white">{transaction.type}</p>
              <p className="mt-1 text-sm text-slate-400">{new Date(transaction.date).toLocaleString()}</p>
              <p className={`mt-2 text-lg font-semibold ${transaction.amount < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
                {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
