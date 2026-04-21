import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAlerts } from '../api/queries';

export function AlertsPage() {
  const { data: alerts = [], isLoading, error } = useAlerts();

  if (isLoading) return <p className="text-gray-500">Chargement des alertes…</p>;
  if (error) return <p className="text-red-600">Erreur de chargement.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <AlertTriangle size={22} className="text-red-600" /> Alertes actives
      </h1>

      {alerts.length === 0 ? (
        <div className="flex items-center gap-3 text-green-700 bg-green-50 rounded-xl p-6">
          <CheckCircle size={24} />
          <p className="font-medium">Aucune alerte — tous les lots sont dans la plage cible.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 ${
                alert.severity === 'CRITICAL'
                  ? 'border-red-200 bg-red-50'
                  : 'border-orange-200 bg-orange-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    size={16}
                    className={alert.severity === 'CRITICAL' ? 'text-red-600' : 'text-orange-600'}
                  />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      alert.severity === 'CRITICAL' ? 'text-red-600' : 'text-orange-600'
                    }`}
                  >
                    {alert.severity === 'CRITICAL' ? 'Critique' : 'Avertissement'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(alert.detectedAt).toLocaleString('fr-FR')}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-800">{alert.message}</p>

              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <span>Lot : <Link to={`/lots/${alert.lotId}`} className="text-brand-700 hover:underline font-medium">{alert.lotReference}</Link></span>
                {alert.countryName && <span>Pays : {alert.countryName}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4">Rafraîchissement automatique toutes les 60 s</p>
    </div>
  );
}
