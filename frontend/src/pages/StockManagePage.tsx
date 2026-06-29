import { useState } from 'react';
import { ArrowLeft, PackagePlus, Pencil, ShieldOff, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useCreateLot, useDeleteLot, useUpdateLot } from '../api/mutations';
import { useLotsByCountry } from '../api/queries';
import { CountryTabs } from '../components/CountryTabs';
import { LotFormModal } from '../components/LotFormModal';
import { StatusBadge } from '../components/StatusBadge';
import { isSiege, useCurrentUser } from '../hooks/useCurrentUser';
import type { CreateLotInput, LotSummary } from '../types';

const COUNTRY_LABELS: Record<string, string> = {
  BR: 'Brésil',
  EC: 'Équateur',
  CO: 'Colombie',
};

export function StockManagePage() {
  const { countryCode = 'BR' } = useParams();
  const user = useCurrentUser();
  const readOnly = isSiege(user);
  const { data: lots = [], isLoading } = useLotsByCountry(countryCode);

  const createMut = useCreateLot(countryCode);
  const updateMut = useUpdateLot(countryCode);
  const deleteMut = useDeleteLot(countryCode);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<LotSummary | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleSubmit(data: CreateLotInput) {
    if (editing) {
      updateMut.mutate(
        { lotId: editing.id, data },
        { onSuccess: () => { setEditing(null); setShowForm(false); } },
      );
    } else {
      createMut.mutate(data, { onSuccess: () => setShowForm(false) });
    }
  }

  function handleDelete(lotId: string) {
    deleteMut.mutate(lotId, { onSuccess: () => setConfirmDeleteId(null) });
  }

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

      {/* Action bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {isLoading ? 'Chargement…' : `${lots.length} lot(s) en stock · Ordre FIFO`}
        </p>
        {readOnly ? (
          <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 text-sm rounded-lg cursor-not-allowed">
            <ShieldOff size={15} /> Consultation seule (siège)
          </span>
        ) : (
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-700 text-white text-sm font-medium rounded-lg hover:bg-brand-900"
          >
            <PackagePlus size={15} /> Nouveau lot
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['#', 'Référence', 'Produit', 'Producteur', 'Quantité', 'Entrée stockage', 'Âge', 'Statut', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Chargement…</td></tr>
            )}
            {!isLoading && lots.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center">
                  <p className="text-gray-400 mb-3">Aucun lot enregistré pour ce pays.</p>
                  {!readOnly && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-700 text-white text-sm rounded-lg hover:bg-brand-900"
                    >
                      <PackagePlus size={14} /> Créer le premier lot
                    </button>
                  )}
                </td>
              </tr>
            )}
            {lots.map((lot, i) => (
              <tr key={lot.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 font-mono text-xs w-8">{i + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{lot.reference}</td>
                <td className="px-4 py-3 text-gray-700">{lot.productName}</td>
                <td className="px-4 py-3 text-gray-600">{lot.producer}</td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{lot.quantityKg.toLocaleString('fr-FR')} kg</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {new Date(lot.storedAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lot.storageDays} j</td>
                <td className="px-4 py-3">
                  <StatusBadge inRange={lot.conditionsInRange} storageDays={lot.storageDays} />
                </td>
                <td className="px-4 py-3">
                  {!readOnly && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditing(lot); setShowForm(true); }}
                        className="p-1.5 text-gray-400 hover:text-brand-700 hover:bg-brand-50 rounded transition-colors"
                        title="Modifier ce lot"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(lot.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer ce lot"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        La suppression d'un lot efface aussi tout son historique de mesures IoT (températures, humidités).
      </p>

      {/* Modal création / modification */}
      {showForm && (
        <LotFormModal
          lot={editing ?? undefined}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditing(null); }}
          isPending={createMut.isPending || updateMut.isPending}
        />
      )}

      {/* Confirmation de suppression */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Supprimer ce lot ?</h3>
            <p className="text-sm text-gray-600 mb-5">
              Cette action supprimera également tout l'historique des mesures IoT. Elle est <strong>irréversible</strong>.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleteMut.isPending}
                className="px-5 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
              >
                {deleteMut.isPending ? 'Suppression…' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
