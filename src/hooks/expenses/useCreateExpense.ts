import { useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseRepository } from '../../repositories/ExpenseRepository';
import { CreateExpenseInput } from '../../types/expense.types';
import { expenseKeys } from './expenseKeys';

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateExpenseInput) =>
      expenseRepository.createExpense(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: expenseKeys.list(variables.ownerId, variables.siteId),
      });
    },
  });
}
