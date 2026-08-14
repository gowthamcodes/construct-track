import { ExpenseCategory } from './expense.types';

export type CategoryTotals = Record<ExpenseCategory, number>;

export interface MonthlyTotal {
  month: string;
  amount: number;
}

export interface DashboardSummary {
  ownerId: string;
  siteId: string;
  totalExpense: number;
  currentMonthExpense: number;
  currentYearExpense: number;
  expenseCount: number;
  categoryTotals: CategoryTotals;
  monthlyTotals: MonthlyTotal[];
  updatedAt: Date | null;
}
