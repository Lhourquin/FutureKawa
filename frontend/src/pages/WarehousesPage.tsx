import { ArrowLeft, Thermometer, Droplets, PackageCheck, AlertTriangle, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useWarehouses } from '../api/queries';
import { CountryTabs } from '../components/CountryTabs';

const COUNTRY_LABELS: Record<string, string> = {
  BR: 'Brésil',
  EC: 'Équateur',
  CO: 'Colombie',
};

export function WarehousesPage() {
  const { countryCode = 'BR' } = useParams();
  const { data: warehouses = [], isLoading } = useWarehouses(countryCode);

  return (
    <div className="flex flex-col gap-3">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/countries" className="flex items-center gap-1 hover:text-gray-800">
          <ArrowLeft size={14} /> Tableau de bord
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-800">{COUNTRY_LABELS[countryCode] ?? countryCode}</span>
      </div>

      {/* Tabs */}
      <CountryTabs countryCode={countryCode} />

      {/* Content */}
      {isLoading ? (
        <p className="text-gray-400 text-sm p-4">Chargement…</p>
      ) : warehouses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
          <p className="text-gray-400 mb-2">Aucun entrepôt actif.</p>
          <p className="text-xs text-gray-400">
            Les entrepôts apparaissent automatiquement dès qu'un lot y est enregistré.
          </p>
          <Link
            to={`/countries/${countryCode}/manage`}
            className="inline-block mt-4 text-sm text-brand-700 hover:underline font-medium"
          >
            → Créer un premier lot
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {warehouses.map((wh) => (
            <WarehouseCard key={wh.warehouseId} wh={wh} countryCode={countryCode} />
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        Rafraîchissement automatique toutes les 10 s · Données agrégées depuis les lots en stockage.
      </p>
    </div>
  );
}

function WarehouseCard({
  wh,
  countryCode,
}: {
  wh: {
    warehouseId: string;
    warehouseName: string;
    totalLots: number;
    totalQuantityKg: number;
    lotsInRange: number;
    lotsOutOfRange: number;
    lotsOverdue: number;
    averageTemperatureC: number | null;
    averageHumidityPercent: number | null;
  };
  countryCode: string;
}) {
  const allGood = wh.lotsOutOfRange === 0 && wh.lotsOverdue === 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`px-5 py-4 border-b border-gray-100 flex items-center justify-between ${allGood ? 'bg-green-50' : 'bg-orange-50'}`}>
        <div>
          <h2 className="text-lg font-bold text-gray-800">{wh.warehouseName}</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-mono">{wh.warehouseId}</p>
        </div>
        {allGood ? (
          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
            <PackageCheck size={12} /> Tout conforme
          </span>
        ) : (
          <div className="flex flex-col gap-1 items-end">
            {wh.lotsOutOfRange > 0 && (
              <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                <AlertTriangle size={11} /> {wh.lotsOutOfRange} hors plage
              </span>
            )}
            {wh.lotsOverdue > 0 && (
              <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                <Clock size={11} /> {wh.lotsOverdue} périmé(s)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-px bg-gray-100">
        <StatCell
          icon={<Thermometer size={14} className="text-blue-500" />}
          label="Température moyenne"
          value={wh.averageTemperatureC != null ? `${wh.averageTemperatureC} °C` : '—'}
        />
        <StatCell
          icon={<Droplets size={14} className="text-orange-400" />}
          label="Humidité moyenne"
          value={wh.averageHumidityPercent != null ? `${wh.averageHumidityPercent} %` : '—'}
        />
        <StatCell
          label="Lots en stockage"
          value={`${wh.totalLots} lot${wh.totalLots > 1 ? 's' : ''}`}
        />
        <StatCell
          label="Quantité totale"
          value={`${wh.totalQuantityKg.toLocaleString('fr-FR')} kg`}
        />
      </div>

      {/* Status breakdown */}
      <div className="px-5 py-3 flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100">
        <span className="text-green-700 font-medium">{wh.lotsInRange} conforme{wh.lotsInRange > 1 ? 's' : ''}</span>
        <span>·</span>
        <span className={wh.lotsOutOfRange > 0 ? 'text-red-600 font-medium' : ''}>
          {wh.lotsOutOfRange} hors plage
        </span>
        <span>·</span>
        <span className={wh.lotsOverdue > 0 ? 'text-orange-600 font-medium' : ''}>
          {wh.lotsOverdue} périmé{wh.lotsOverdue > 1 ? 's' : ''}
        </span>
        <Link
          to={`/countries/${countryCode}/lots`}
          className="ml-auto text-brand-700 hover:underline font-medium"
        >
          Voir les lots →
        </Link>
      </div>
    </div>
  );
}

function StatCell({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white px-4 py-3">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
        {icon}
        {label}
      </div>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  );
}
