import { Expense, ExpenseFilters } from '../types/expense.types';

export function filterExpenses(
  expenses: Expense[],
  filters: ExpenseFilters,
): Expense[] {
  const search = filters.search.trim().toLowerCase();

  return [...expenses]
    .filter(expense => {
      if (search) {
        const matches =
          expense.title.toLowerCase().includes(search) ||
          Boolean(expense.vendor?.toLowerCase().includes(search)) ||
          expense.tags.some(tag => tag.toLowerCase().includes(search));
        if (!matches) return false;
      }

      if (filters.category !== 'all' && expense.category !== filters.category)
        return false;
      if (
        filters.paymentMode !== 'all' &&
        expense.paymentMode !== filters.paymentMode
      )
        return false;
      if (filters.startDate && expense.expenseDate < filters.startDate)
        return false;
      if (filters.endDate && expense.expenseDate > filters.endDate)
        return false;
      if (filters.minAmount !== null && expense.amount < filters.minAmount)
        return false;
      if (filters.maxAmount !== null && expense.amount > filters.maxAmount)
        return false;

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return a.expenseDate.getTime() - b.expenseDate.getTime();
        case 'highest':
          return b.amount - a.amount;
        case 'lowest':
          return a.amount - b.amount;
        default:
          return b.expenseDate.getTime() - a.expenseDate.getTime();
      }
    });
}
