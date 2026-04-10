import { useState } from 'react';
import { Wallet, Landmark, CreditCard } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export function WalletPage() {
  const { token, updateAuth, user } = useAuth();
  const { pushToast } = useApp();
  const { data, setData } = useFetch('/wallet');
  const [amount, setAmount] = useState(50);
  const [method, setMethod] = useState('Bank Transfer');
  const [submitting, setSubmitting] = useState(false);

  async function handleDeposit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await apiRequest('/wallet/deposit', {
        method: 'POST',
        token,
        body: JSON.stringify({ amount: Number(amount), method }),
      });
      updateAuth(response.user);
      setData((current) => ({
        ...current,
        balance: response.user.balance,
        transactions: [
          { id: Date.now(), type: `deposit:${method}`, amount: Number(amount), date: new Date().toISOString() },
          ...(current?.transactions || []),
        ],
      }));
      pushToast({ title: 'Deposit successful', message: `$${Number(amount).toFixed(2)} added with ${method}.` });
    } catch (error) {
      pushToast({ title: 'Deposit failed', message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  const balance = Number(data?.balance ?? user?.balance ?? 0);
  const payout = Math.max(balance * 0.12, 50);
  const bonus = Math.max(balance * 0.05, 20);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="glass-card rounded-[2rem] p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold text-white">Wallet Overview</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Deposit is now active in local demo mode. Choose a bank or wallet method and your balance updates instantly.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Main Balance</p>
            <p className="mt-2 text-3xl font-semibold text-white">${balance.toFixed(2)}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Pending Payouts</p>
            <p className="mt-2 text-3xl font-semibold text-white">${payout.toFixed(2)}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Bonus Credit</p>
            <p className="mt-2 text-3xl font-semibold text-white">${bonus.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><Landmark className="h-5 w-5" /> Deposit Money</h3>
          <form className="mt-4 grid gap-3 md:grid-cols-3" onSubmit={handleDeposit}>
            <label className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Amount</span>
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="mt-2 w-full bg-transparent text-white outline-none"
              />
            </label>
            <label className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Method</span>
              <select value={method} onChange={(event) => setMethod(event.target.value)} className="mt-2 w-full bg-transparent outline-none">
                {(data?.paymentMethods || []).map((item) => (
                  <option key={item} value={item} className="text-slate-900">{item}</option>
                ))}
              </select>
            </label>
            <button disabled={submitting} type="submit" className="button-primary h-full w-full justify-center">
              <CreditCard className="h-4 w-4" />
              {submitting ? 'Processing...' : 'Confirm Deposit'}
            </button>
          </form>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <div className="mt-4 space-y-2">
            {(data?.transactions || []).length === 0 ? (
              <p className="text-sm text-slate-400">No transactions yet.</p>
            ) : (
              (data?.transactions || []).slice(0, 8).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{tx.type}</p>
                    <p className="text-xs text-slate-400">{new Date(tx.date).toLocaleString()}</p>
                  </div>
                  <p className={`text-sm font-semibold ${Number(tx.amount) >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {Number(tx.amount) >= 0 ? '+' : ''}${Math.abs(Number(tx.amount)).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-6">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-white"><Wallet className="h-5 w-5" /> Quick Actions</h2>
        <div className="mt-6 space-y-3">
          <button type="button" className="button-primary w-full justify-center">Deposit Now</button>
          <button type="button" className="button-secondary w-full justify-center">Withdraw</button>
          <button type="button" className="button-secondary w-full justify-center">Transfer Bonus</button>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Supported Methods</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(data?.paymentMethods || []).map((methodName) => (
              <span key={methodName} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white">
                {methodName}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
