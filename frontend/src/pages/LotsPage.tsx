import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAlerts, useCountryOverview, useLotsByCountry, useMeasurements } from '../api/queries';
import { CountryTabs } from '../components/CountryTabs';
import { SensorChart } from '../components/SensorChart';
import { StatusBadge } from '../components/StatusBadge';
import { isSiege, useCurrentUser } from '../hooks/useCurrentUser';
import type { CountryOverview } from '../types';

const COUNTRY_LABELS: Record<string, string> = {
  BR: 'Brésil',
  EC: 'Équateur',
  CO: 'Colombie',
};

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-1">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
      <p className="text-3xl font-bold text-gray-800 mt-auto">{value}</p>
    </div>
  );
}

function fmtTemp(o: CountryOverview | undefined) {
  return o?.averageLatestTemperatureC != null ? `${o.averageLatestTemperatureC.toFixed(1)} °C` : '—';
}
function fmtHum(o: CountryOverview | undefined) {
  return o?.averageLatestHumidityPercent != null ? `${o.averageLatestHumidityPercent.toFixed(1)} %` : '—';
}

export function LotsPage() {
  const { countryCode = 'BR' } = useParams();
  const user = useCurrentUser();
  const [selectedLotId, setSelectedLotId] = useState<string>('');

  const { data: lots = [], isLoading } = useLotsByCountry(countryCode);
  const { data: overview } = useCountryOverview(countryCode);
  const { data: alerts = [] } = useAlerts();
  const { data: measurements = [] } = useMeasurements(selectedLotId);

  useEffect(() => {
    if (lots.length > 0 && !selectedLotId) setSelectedLotId(lots[0].id);
  }, [lots, selectedLotId]);

  const selectedLot = lots.find((l) => l.id === selectedLotId);
  const countryAlerts = alerts.filter((a) => !a.countryCode || a.countryCode === countryCode);

  if (isLoading) return <p className="text-gray-500 p-4">Chargement…</p>;

  return (
    <div className="h-full flex flex-col gap-3">

      {/* Breadcrumb + title */}
      <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
        <Link to="/countries" className="flex items-center gap-1 hover:text-gray-800">
          <ArrowLeft size={14} /> Tableau de bord
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-800">{COUNTRY_LABELS[countryCode] ?? countryCode}</span>
      </div>

      {/* Tabs */}
      <CountryTabs countryCode={countryCode} />

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        <KpiCard
          label="Santé des lots"
          sub={overview?.lotsStoredOver365Days ? `${overview.lotsStoredOver365Days} lot(s) périmé(s)` : 'Aucun périmé'}
          value={`${overview?.lotsInRange ?? 0} / ${overview?.totalLots ?? '—'}`}
        />
        <KpiCard label="Température moyenne" value={fmtTemp(overview)} />
        <KpiCard label="Humidité moyenne" value={fmtHum(overview)} />
      </div>

      {/* Dashboard */}
      <div className="flex gap-3 flex-1 min-h-0">

        {/* Lots list */}
        <div className="w-40 flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="px-3 py-2.5 text-xs font-semibold text-gray-500 border-b border-gray-100 flex-shrink-0 uppercase tracking-wide">
            Lots (FIFO)
          </div>
          {lots.length === 0 ? (
            <p className="text-xs text-gray-400 p-3">
              Aucun lot.{' '}
              {!isSiege(user) && (
                <Link to={`/countries/${countryCode}/manage`} className="text-brand-700 underline">
                  Créer un lot
                </Link>
              )}
            </p>
          ) : (
            lots.map((lot, i) => (
              <button
                key={lot.id}
                onClick={() => setSelectedLotId(lot.id)}
                className={`w-full text-left px-3 py-3 border-b border-gray-100 last:border-0 transition-colors ${
                  lot.id === selectedLotId ? 'bg-brand-50 border-l-2 border-l-brand-700' : 'hover:bg-gray-50'
                }`}
              >
                <span className="block text-xs text-gray-400 font-mono">LOT N°{i + 1}</span>
                <span className="block text-xs font-medium text-gray-800 truncate mt-0.5">{lot.reference}</span>
              </button>
            ))
          )}
        </div>

        {/* Chart */}
        <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col">
          {selectedLot ? (
            <>
              <div className="flex items-center gap-4 mb-3 flex-shrink-0 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{selectedLot.reference}</p>
                  <p className="text-xs text-gray-500">{selectedLot.productName} — {selectedLot.producer}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 ml-2">
                  <span>Stocké depuis : <strong className="text-gray-700">{new Date(selectedLot.storedAt).toLocaleDateString('fr-FR')}</strong></span>
                  <span>Âge : <strong className="text-gray-700">{selectedLot.storageDays} j</strong></span>
                </div>
                <StatusBadge inRange={selectedLot.conditionsInRange} storageDays={selectedLot.storageDays} />
                <Link to={`/lots/${selectedLot.id}`} className="text-xs text-brand-700 hover:underline ml-auto">
                  Fiche complète →
                </Link>
              </div>
              <div className="flex-1 min-h-0">
                <SensorChart measurements={measurements} />
              </div>
              <p className="text-xs text-gray-400 mt-1 flex-shrink-0">
                Rafraîchissement automatique toutes les 10 s · {measurements.length} relevés IoT
              </p>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
              Sélectionnez un lot dans la liste pour voir son historique IoT.
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="w-48 flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="px-3 py-2.5 text-xs font-semibold text-gray-500 border-b border-gray-100 flex-shrink-0 uppercase tracking-wide flex items-center justify-between">
            Alertes actives
            {countryAlerts.length > 0 && (
              <span className="bg-red-100 text-red-700 rounded-full px-1.5 py-0.5 text-xs font-bold">
                {countryAlerts.length}
              </span>
            )}
          </div>
          <div className="p-2 overflow-y-auto flex-1 space-y-2">
            {countryAlerts.length === 0 ? (
              <p className="text-xs text-gray-400 p-2 text-center">
                ✓ Aucune alerte active
              </p>
            ) : (
              countryAlerts.map((a) => (
                <div
                  key={a.id}
                  className={`text-xs p-2.5 rounded-lg ${
                    a.severity === 'CRITICAL' ? 'bg-red-50 border border-red-100' : 'bg-orange-50 border border-orange-100'
                  }`}
                >
                  <p className={`font-semibold truncate ${a.severity === 'CRITICAL' ? 'text-red-700' : 'text-orange-700'}`}>
                    {a.lotReference}
                  </p>
                  <p className="text-gray-600 mt-0.5 line-clamp-3 leading-tight">{a.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
