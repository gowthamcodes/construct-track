import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import {
  EXPENSE_CATEGORIES,
  Expense,
  ExpenseCategory,
} from '../types/expense.types';

import { DashboardSummary, MonthlyTotal } from '../types/dashboard.types';

class DashboardRepository {
  private readonly db = getFirestore();

  async getSummary(ownerId: string, siteId: string): Promise<DashboardSummary> {
    const expensesRef = collection(this.db, 'expenses');

    const expensesQuery = query(
      expensesRef,
      where('ownerId', '==', ownerId),
      where('siteId', '==', siteId),
    );

    const snapshot = await getDocs(expensesQuery);

    return buildSummary(ownerId, siteId, snapshot.docs.map(mapExpense));
  }

  subscribe(
    ownerId: string,
    siteId: string,
    onData: (summary: DashboardSummary) => void,
    onError?: (error: Error) => void,
  ) {
    const expensesRef = collection(this.db, 'expenses');

    const expensesQuery = query(
      expensesRef,
      where('ownerId', '==', ownerId),
      where('siteId', '==', siteId),
    );

    return onSnapshot(
      expensesQuery,
      snapshot => {
        const expenses = snapshot.docs.map(mapExpense);

        onData(buildSummary(ownerId, siteId, expenses));
      },
      error => {
        onError?.(error);
      },
    );
  }
}

function mapExpense(
  document: FirebaseFirestoreTypes.QueryDocumentSnapshot,
): Expense {
  const data = document.data();

  return {
    id: document.id,
    ownerId: data.ownerId,
    siteId: data.siteId,
    title: data.title,
    amount: Number(data.amount) || 0,
    category: data.category,
    tags: data.tags ?? [],
    vendor: data.vendor ?? null,
    paymentMode: data.paymentMode,
    expenseDate: data.expenseDate.toDate(),
    notes: data.notes ?? null,
    createdBy: data.createdBy,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
}

function buildSummary(
  ownerId: string,
  siteId: string,
  expenses: Expense[],
): DashboardSummary {
  const now = new Date();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let totalExpense = 0;
  let currentMonthExpense = 0;
  let currentYearExpense = 0;

  const categoryTotals = EXPENSE_CATEGORIES.reduce(
    (result, category) => {
      result[category] = 0;
      return result;
    },
    {} as DashboardSummary['categoryTotals'],
  );

  const monthlyMap = new Map<string, number>();

  for (const expense of expenses) {
    const amount = Number(expense.amount) || 0;
    const date = expense.expenseDate;

    totalExpense += amount;

    if (date.getFullYear() === currentYear) {
      currentYearExpense += amount;
    }

    if (
      date.getFullYear() === currentYear &&
      date.getMonth() === currentMonth
    ) {
      currentMonthExpense += amount;
    }

    const category = expense.category as ExpenseCategory;

    categoryTotals[category] = (categoryTotals[category] ?? 0) + amount;

    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}`;

    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + amount);
  }

  const monthlyTotals: MonthlyTotal[] = Array.from(monthlyMap.entries())
    .map(([month, amount]) => ({
      month,
      amount,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    ownerId,
    siteId,
    totalExpense,
    currentMonthExpense,
    currentYearExpense,
    expenseCount: expenses.length,
    categoryTotals,
    monthlyTotals,
    updatedAt: new Date(),
  };
}

export const dashboardRepository = new DashboardRepository();
