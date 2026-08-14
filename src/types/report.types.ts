import { Expense, ExpenseCategory, PaymentMode } from './expense.types';

export interface ReportSummary {
  totalExpense: number;
  transactionCount: number;
  averageExpense: number;
  highestExpense: number;
  lowestExpense: number;
}

export interface CategoryReport {
  category: ExpenseCategory;
  amount: number;
  count: number;
  percentage: number;
}

export interface PaymentReport {
  paymentMode: PaymentMode;
  amount: number;
  count: number;
  percentage: number;
}

export interface VendorReport {
  vendor: string;
  amount: number;
  count: number;
}

export interface MonthlyReport {
  month: string;
  amount: number;
  count: number;
}

export interface ExpenseReport {
  summary: ReportSummary;
  categories: CategoryReport[];
  payments: PaymentReport[];
  vendors: VendorReport[];
  monthly: MonthlyReport[];
  expenses: Expense[];
}
