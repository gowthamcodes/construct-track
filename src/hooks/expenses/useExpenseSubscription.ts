import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { expenseRepository } from '../../repositories/ExpenseRepository';
import { expenseKeys } from './expenseKeys';

export function useExpenseSubscription(ownerId?: string, siteId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!ownerId || !siteId) return;

    return expenseRepository.subscribe(
      ownerId,
      siteId,
      expenses => {
        queryClient.setQueryData(expenseKeys.list(ownerId, siteId), expenses);
      },
      error => console.error('[ExpenseSubscription]', error),
    );
  }, [ownerId, siteId, queryClient]);
}
