export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-400/20 border-t-emerald-400" />
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Loading PrimeBets</p>
      </div>
    </div>
  );
}
