import { BarChart2, Package, Warehouse } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { isSiege, useCurrentUser } from '../hooks/useCurrentUser';

type Props = { countryCode: string };

export function CountryTabs({ countryCode }: Props) {
  const user = useCurrentUser();
  const base = 'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap';
  const active = 'border-brand-700 text-brand-700 bg-brand-50/50';
  const inactive = 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300';

  return (
    <div className="flex border-b border-gray-200 flex-shrink-0 bg-white rounded-t-xl -mb-px overflow-x-auto">
      <NavLink
        to={`/countries/${countryCode}/lots`}
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <BarChart2 size={15} /> Surveillance
      </NavLink>
      <NavLink
        to={`/countries/${countryCode}/warehouses`}
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <Warehouse size={15} /> Entrepôts
      </NavLink>
      {!isSiege(user) && (
        <NavLink
          to={`/countries/${countryCode}/manage`}
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          <Package size={15} /> Gestion des stocks
        </NavLink>
      )}
    </div>
  );
}
