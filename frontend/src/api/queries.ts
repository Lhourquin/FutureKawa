import { useQuery } from '@tanstack/react-query';
import { ALERTS_INTERVAL_MS, REALTIME_INTERVAL_MS } from '../config';
import {
  fetchAlerts, fetchCountries, fetchCountryOverview,
  fetchLotDetail, fetchLotsByCountry, fetchMeasurements, fetchWarehouses,
} from './index';

export const useCountries = () => useQuery({ queryKey: ['countries'], queryFn: fetchCountries });

export const useCountryOverview = (code: string) =>
  useQuery({ queryKey: ['country-overview', code], queryFn: () => fetchCountryOverview(code), enabled: !!code, refetchInterval: REALTIME_INTERVAL_MS });

export const useLotsByCountry = (code: string) =>
  useQuery({ queryKey: ['lots', code], queryFn: () => fetchLotsByCountry(code), enabled: !!code, refetchInterval: REALTIME_INTERVAL_MS });

export const useLotDetail = (id: string) =>
  useQuery({ queryKey: ['lot', id], queryFn: () => fetchLotDetail(id), enabled: !!id, refetchInterval: REALTIME_INTERVAL_MS });

export const useMeasurements = (id: string) =>
  useQuery({
    queryKey: ['measurements', id],
    queryFn: () => fetchMeasurements(id),
    enabled: !!id,
    refetchInterval: REALTIME_INTERVAL_MS,
  });

export const useAlerts = () =>
  useQuery({ queryKey: ['alerts'], queryFn: fetchAlerts, refetchInterval: ALERTS_INTERVAL_MS });

export const useWarehouses = (code: string) =>
  useQuery({
    queryKey: ['warehouses', code],
    queryFn: () => fetchWarehouses(code),
    enabled: !!code,
    refetchInterval: REALTIME_INTERVAL_MS,
  });
