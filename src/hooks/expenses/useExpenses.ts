import { useQuery } from '@tanstack/react-query';
import { expenseRepository } from '../../repositories/ExpenseRepository';
import { expenseKeys } from './expenseKeys';

export function useExpenses(ownerId?: string, siteId?: string) {
  return useQuery({
    queryKey: expenseKeys.list(ownerId ?? '', siteId ?? ''),
    queryFn: () =>
      ownerId && siteId ? expenseRepository.getExpenses(ownerId, siteId) : [],
    enabled: Boolean(ownerId && siteId),
  });
}
