import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function AppShell() {
  return (
    <div className="min-h-screen bg-app-gradient">
      <Sidebar />
      <div className="min-h-screen md:pl-80">
        <Navbar />
        <main className="px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
