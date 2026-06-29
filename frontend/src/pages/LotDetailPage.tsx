import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useLotDetail, useMeasurements } from '../api/queries';
import { SensorChart } from '../components/SensorChart';
import { StatusBadge } from '../components/StatusBadge';

export function LotDetailPage() {
  const { lotId = '' } = useParams();
  const { data: lot, isLoading: lotLoading } = useLotDetail(lotId);
  const { data: measurements = [] } = useMeasurements(lotId);

  if (lotLoading) return <p className="text-gray-500">Chargement…</p>;
  if (!lot) return <p className="text-red-600">Lot introuvable.</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/countries/${lot.countryCode}/lots`} className="text-gray-400 hover:text-gray-700">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold">{lot.reference}</h1>
        <StatusBadge inRange={lot.conditionsInRange} storageDays={lot.storageDays} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 space-y-2 text-sm">
          <h2 className="font-semibold text-gray-700 mb-2">Informations lot</h2>
          <Row label="Produit" value={lot.productName} />
          <Row label="Producteur" value={lot.producer} />
          <Row label="Pays" value={lot.countryName} />
          <Row label="Quantité" value={`${lot.quantityKg} kg`} />
          <Row label="Récolte" value={new Date(lot.harvestDate).toLocaleDateString('fr-FR')} />
          <Row label="En stockage depuis" value={new Date(lot.storedAt).toLocaleDateString('fr-FR')} />
          <Row label="Ancienneté" value={`${lot.storageDays} jours`} />
        </div>

        <div className="bg-white rounded-xl border p-4 space-y-2 text-sm">
          <h2 className="font-semibold text-gray-700 mb-2">Dernières conditions</h2>
          <Row label="Température" value={lot.latestTemperatureC !== null ? `${lot.latestTemperatureC}°C` : '—'} />
          <Row label="Humidité" value={lot.latestHumidityPercent !== null ? `${lot.latestHumidityPercent}%` : '—'} />
          <Row label="Mesure le" value={lot.latestMeasuredAt ? new Date(lot.latestMeasuredAt).toLocaleString('fr-FR') : '—'} />
          <div className="pt-2">
            <StatusBadge inRange={lot.conditionsInRange} storageDays={lot.storageDays} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="font-semibold text-gray-700 mb-4">Historique des mesures IoT</h2>
        <SensorChart measurements={measurements} />
        <p className="text-xs text-gray-400 mt-2">Rafraîchissement automatique toutes les 30 s · {measurements.length} relevés</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
