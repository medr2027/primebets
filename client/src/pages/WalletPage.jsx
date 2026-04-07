export function WalletPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="glass-card rounded-[2rem] p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold text-white">Wallet Overview</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          This section is UI-only for now, ready for future extension with deposits, withdrawals, and bonus workflows.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Main Balance</p>
            <p className="mt-2 text-3xl font-semibold text-white">$2,480.25</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Pending Payouts</p>
            <p className="mt-2 text-3xl font-semibold text-white">$315.00</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Bonus Credit</p>
            <p className="mt-2 text-3xl font-semibold text-white">$120.00</p>
          </div>
        </div>
      </div>
      <div className="glass-card rounded-[2rem] p-6">
        <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
        <div className="mt-6 space-y-3">
          <button type="button" className="button-primary w-full justify-center">Add funds</button>
          <button type="button" className="button-secondary w-full justify-center">Withdraw</button>
          <button type="button" className="button-secondary w-full justify-center">Transfer bonus</button>
        </div>
      </div>
    </div>
  );
}
