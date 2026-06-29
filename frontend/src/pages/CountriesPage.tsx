import { BarChart2, Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useCountries, useCountryOverview } from '../api/queries';
import { isSiege, isOperator, useCurrentUser } from '../hooks/useCurrentUser';
import type { Country, CountryOverview } from '../types';

const FLAG: Record<string, string> = { BR: '🇧🇷', EC: '🇪🇨', CO: '🇨🇴' };

export function CountriesPage() {
  const user = useCurrentUser();
  const { data: countries = [], isLoading } = useCountries();

  // Un exploitant n'a accès qu'à son pays — on le redirige directement
  if (isOperator(user) && user?.country && user.country !== 'all') {
    return <Navigate to={`/countries/${user.country}/lots`} replace />;
  }

  if (isLoading) return <p className="text-gray-500 p-4">Chargement…</p>;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord — Siège</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Supervision consolidée de tous les pays. Consultation uniquement.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {countries.map((c) => (
          <CountryCard key={c.code} country={c} canManage={isSiege(user) === false} />
        ))}
      </div>
    </div>
  );
}

function CountryCard({ country, canManage }: { country: Country; canManage: boolean }) {
  const { data: overview, isError, isLoading } = useCountryOverview(country.code);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{FLAG[country.code] ?? '🌍'}</span>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{country.name}</h2>
            <p className="text-xs text-gray-400">
              Cible : {country.targetTemperatureC}°C ±{country.temperatureToleranceC}°C
              · {country.targetHumidityPercent}% ±{country.humidityTolerancePercent}%
            </p>
          </div>
        </div>
        <StatusChip overview={overview} isError={isError} isLoading={isLoading} />
      </div>

      {/* Stats row */}
      {!isError && (
        <div className="grid grid-cols-4 divide-x divide-gray-100 px-0">
          <Stat label="Lots en stock" value={isLoading ? '…' : (overview?.totalLots ?? '—')} />
          <Stat
            label="Conformes"
            value={isLoading ? '…' : `${overview?.lotsInRange ?? '—'} / ${overview?.totalLots ?? '—'}`}
            color={overview?.lotsOutOfRange === 0 ? 'text-green-600' : undefined}
          />
          <Stat
            label="Température moy."
            value={
              overview?.averageLatestTemperatureC != null
                ? `${overview.averageLatestTemperatureC.toFixed(1)} °C`
                : '—'
            }
          />
          <Stat
            label="Humidité moy."
            value={
              overview?.averageLatestHumidityPercent != null
                ? `${overview.averageLatestHumidityPercent.toFixed(1)} %`
                : '—'
            }
          />
        </div>
      )}

      {isError && (
        <div className="px-6 py-3 text-sm text-gray-400 italic">
          Backend pays non disponible pour cette démonstration.
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
        <Link
          to={`/countries/${country.code}/lots`}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-700 text-white text-sm font-medium rounded-lg hover:bg-brand-900 transition-colors"
        >
          <BarChart2 size={15} /> Surveillance IoT
        </Link>
        {canManage && (
          <Link
            to={`/countries/${country.code}/manage`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-white transition-colors"
          >
            <Package size={15} /> Gérer les stocks
          </Link>
        )}
      </div>
    </div>
  );
}

function StatusChip({
  overview,
  isError,
  isLoading,
}: {
  overview: CountryOverview | undefined;
  isError: boolean;
  isLoading: boolean;
}) {
  if (isError)
    return (
      <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full">
        À venir
      </span>
    );
  if (isLoading) return <span className="text-xs text-gray-400">Chargement…</span>;
  if (!overview) return null;

  if (overview.lotsStoredOver365Days > 0)
    return (
      <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
        <Clock size={12} /> {overview.lotsStoredOver365Days} périmé(s)
      </span>
    );
  if (overview.lotsOutOfRange > 0)
    return (
      <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
        <AlertTriangle size={12} /> {overview.lotsOutOfRange} hors plage
      </span>
    );
  if (overview.totalLots === 0)
    return (
      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
        Aucun lot
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
      <CheckCircle size={12} /> Tout conforme
    </span>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="px-6 py-3 text-center">
      <p className={`text-xl font-bold ${color ?? 'text-gray-800'}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
