type Props = {
  inRange: boolean | null;
  storageDays?: number;
};

export function StatusBadge({ inRange, storageDays }: Props) {
  const expired = storageDays !== undefined && storageDays > 365;

  if (expired) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
        ⏳ Péremption ({storageDays} j)
      </span>
    );
  }

  if (inRange === null) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">— Pas de mesure</span>;
  }

  return inRange ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Conforme</span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">⚠ Hors plage</span>
  );
}
