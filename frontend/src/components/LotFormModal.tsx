import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { CreateLotInput, LotSummary } from '../types';

type Props = {
  lot?: LotSummary;
  onSubmit: (data: CreateLotInput) => void;
  onClose: () => void;
  isPending: boolean;
};

function toDateInput(iso: string): string {
  return iso.slice(0, 10);
}

const EMPTY: CreateLotInput = {
  reference: '',
  productName: '',
  producer: '',
  harvestDate: '',
  storedAt: '',
  quantityKg: 0,
};

export function LotFormModal({ lot, onSubmit, onClose, isPending }: Props) {
  const [form, setForm] = useState<CreateLotInput>(EMPTY);

  useEffect(() => {
    if (lot) {
      setForm({
        reference: lot.reference,
        productName: lot.productName,
        producer: lot.producer,
        harvestDate: toDateInput(lot.storedAt),
        storedAt: toDateInput(lot.storedAt),
        quantityKg: lot.quantityKg,
      });
    } else {
      setForm({ ...EMPTY, storedAt: new Date().toISOString().slice(0, 10) });
    }
  }, [lot]);

  function set(field: keyof CreateLotInput, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ ...form, quantityKg: Number(form.quantityKg) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            {lot ? 'Modifier le lot' : 'Nouveau lot'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Référence *" required>
              <input
                required
                value={form.reference}
                onChange={(e) => set('reference', e.target.value)}
                placeholder="BR-2025-003"
                className={input}
              />
            </Field>
            <Field label="Quantité (kg) *" required>
              <input
                required
                type="number"
                min={1}
                value={form.quantityKg || ''}
                onChange={(e) => set('quantityKg', e.target.value)}
                placeholder="1200"
                className={input}
              />
            </Field>
          </div>

          <Field label="Produit *" required>
            <input
              required
              value={form.productName}
              onChange={(e) => set('productName', e.target.value)}
              placeholder="Arabica Santos"
              className={input}
            />
          </Field>

          <Field label="Producteur *" required>
            <input
              required
              value={form.producer}
              onChange={(e) => set('producer', e.target.value)}
              placeholder="Cooperativa Vale Verde"
              className={input}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date de récolte *" required>
              <input
                required
                type="date"
                value={form.harvestDate}
                onChange={(e) => set('harvestDate', e.target.value)}
                className={input}
              />
            </Field>
            <Field label="Entrée en stockage *" required>
              <input
                required
                type="date"
                value={form.storedAt}
                onChange={(e) => set('storedAt', e.target.value)}
                className={input}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 text-sm font-medium bg-brand-700 text-white rounded-lg hover:bg-brand-900 disabled:opacity-60"
            >
              {isPending ? 'Enregistrement…' : lot ? 'Modifier' : 'Créer le lot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  void required;
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
