import { useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseRepository } from '../../repositories/ExpenseRepository';
import { UpdateExpenseInput } from '../../types/expense.types';
import { expenseKeys } from './expenseKeys';

interface Variables {
  expenseId: string;
  ownerId: string;
  siteId: string;
  data: UpdateExpenseInput;
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expenseId, data }: Variables) =>
      expenseRepository.updateExpense(expenseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: expenseKeys.list(variables.ownerId, variables.siteId),
      });
      queryClient.invalidateQueries({
        queryKey: expenseKeys.detail(variables.expenseId),
      });
    },
  });
}
