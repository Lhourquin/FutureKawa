import { Bell, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAlerts } from '../api/queries';

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { data: alerts = [] } = useAlerts();
  const alertCount = alerts.length;

  function handleLogout() {
    localStorage.removeItem('fk_token');
    navigate('/login');
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">
      <header className="bg-brand-700 text-white shadow flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/countries" className="font-bold text-lg tracking-wide">
            ☕ FutureKawa
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/alerts"
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              <Bell size={15} />
              Alertes
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              <LogOut size={15} /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto max-w-6xl mx-auto w-full px-4 py-5 flex flex-col">
        {children}
      </main>
    </div>
  );
}
