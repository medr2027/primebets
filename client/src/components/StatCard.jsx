export function StatCard({ label, value, accent }) {
  return (
    <div className="glass-card rounded-3xl p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-3xl font-semibold text-white">{value}</p>
        <span className={`h-3 w-3 rounded-full ${accent}`} />
      </div>
    </div>
  );
}
