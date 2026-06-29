import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLot, deleteLot, updateLot } from './index';
import type { CreateLotInput, UpdateLotInput } from '../types';

export const useCreateLot = (countryCode: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLotInput) => createLot(countryCode, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['lots', countryCode] });
      void queryClient.invalidateQueries({ queryKey: ['country-overview', countryCode] });
    },
  });
};

export const useUpdateLot = (countryCode: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lotId, data }: { lotId: string; data: UpdateLotInput }) =>
      updateLot(countryCode, lotId, data),
    onSuccess: (_result, { lotId }) => {
      void queryClient.invalidateQueries({ queryKey: ['lots', countryCode] });
      void queryClient.invalidateQueries({ queryKey: ['lot', lotId] });
      void queryClient.invalidateQueries({ queryKey: ['country-overview', countryCode] });
    },
  });
};

export const useDeleteLot = (countryCode: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lotId: string) => deleteLot(countryCode, lotId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['lots', countryCode] });
      void queryClient.invalidateQueries({ queryKey: ['country-overview', countryCode] });
    },
  });
};
