export const EXPENSE_CATEGORIES = [
  'materials',
  'labor',
  'equipment',
  'transport',
  'electrical',
  'plumbing',
  'miscellaneous',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const PAYMENT_MODES = [
  'cash',
  'upi',
  'bank_transfer',
  'credit_card',
  'other',
] as const;

export type PaymentMode = (typeof PAYMENT_MODES)[number];

export type ExpenseSort = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface Expense {
  id: string;
  ownerId: string;
  siteId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  tags: string[];
  vendor: string | null;
  paymentMode: PaymentMode;
  expenseDate: Date;
  notes: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseInput {
  ownerId: string;
  siteId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  tags: string[];
  vendor?: string;
  paymentMode: PaymentMode;
  expenseDate: Date;
  notes?: string;
}

export type UpdateExpenseInput = Partial<
  Omit<CreateExpenseInput, 'ownerId' | 'siteId'>
>;

export interface ExpenseFilters {
  search: string;
  category: ExpenseCategory | 'all';
  paymentMode: PaymentMode | 'all';
  startDate: Date | null;
  endDate: Date | null;
  minAmount: number | null;
  maxAmount: number | null;
  sortBy: ExpenseSort;
}
