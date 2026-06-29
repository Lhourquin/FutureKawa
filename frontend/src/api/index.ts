import type { Alert, Country, CountryOverview, CreateLotInput, LotDetail, LotSummary, MeasurementItem, UpdateLotInput, WarehouseOverview } from '../types';

const BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('fk_token');
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...init, headers: { ...headers, ...(init.headers as Record<string, string> ?? {}) } });

  if (res.status === 401) {
    localStorage.removeItem('fk_token');
    window.location.href = '/login';
    throw new Error('Non authentifié');
  }
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

export async function login(email: string, password: string): Promise<void> {
  const data = await apiFetch<{ accessToken: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('fk_token', data.accessToken);
}

export const fetchCountries = (): Promise<Country[]> => apiFetch('/countries');
export const fetchCountryOverview = (code: string): Promise<CountryOverview> => apiFetch(`/countries/${code}/overview`);
export const fetchLotsByCountry = (code: string): Promise<LotSummary[]> => apiFetch(`/countries/${code}/lots`);
export const fetchLotDetail = (id: string): Promise<LotDetail> => apiFetch(`/lots/${id}`);
export const fetchMeasurements = (id: string): Promise<MeasurementItem[]> => apiFetch(`/lots/${id}/measurements`);
export const fetchAlerts = (): Promise<Alert[]> => apiFetch('/alerts');

export const fetchWarehouses = (code: string): Promise<WarehouseOverview[]> =>
  apiFetch(`/countries/${code}/warehouses`);

export const createLot = (countryCode: string, data: CreateLotInput): Promise<LotDetail> =>
  apiFetch(`/countries/${countryCode}/lots`, { method: 'POST', body: JSON.stringify(data) });

export const updateLot = (countryCode: string, lotId: string, data: UpdateLotInput): Promise<LotDetail> =>
  apiFetch(`/countries/${countryCode}/lots/${lotId}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deleteLot = (countryCode: string, lotId: string): Promise<void> =>
  apiFetch(`/countries/${countryCode}/lots/${lotId}`, { method: 'DELETE' });
