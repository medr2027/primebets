import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app-gradient px-4 text-center text-white">
      <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">404</p>
      <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-slate-400">The demo route you requested does not exist.</p>
      <Link to="/" className="button-primary mt-8">Back to home</Link>
    </div>
  );
}
