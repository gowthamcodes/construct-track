import { useQuery } from '@tanstack/react-query';
import { expenseRepository } from '../../repositories/ExpenseRepository';
import { expenseKeys } from './expenseKeys';

export function useExpense(expenseId?: string) {
  return useQuery({
    queryKey: expenseKeys.detail(expenseId ?? ''),
    queryFn: () => (expenseId ? expenseRepository.getExpense(expenseId) : null),
    enabled: Boolean(expenseId),
  });
}
