import { useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseRepository } from '../../repositories/ExpenseRepository';
import { expenseKeys } from './expenseKeys';

interface Variables {
  expenseId: string;
  ownerId: string;
  siteId: string;
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expenseId }: Variables) =>
      expenseRepository.deleteExpense(expenseId),
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: expenseKeys.detail(variables.expenseId),
      });
      queryClient.invalidateQueries({
        queryKey: expenseKeys.list(variables.ownerId, variables.siteId),
      });
    },
  });
}
