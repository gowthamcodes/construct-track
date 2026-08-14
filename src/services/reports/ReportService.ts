import {
  Expense,
  ExpenseCategory,
  PaymentMode,
} from '../../types/expense.types';
import {
  ExpenseReport,
  CategoryReport,
  PaymentReport,
  VendorReport,
  MonthlyReport,
} from '../../types/report.types';

export function generateExpenseReport(expenses: Expense[]): ExpenseReport {
  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const transactionCount = expenses.length;
  const averageExpense = transactionCount ? totalExpense / transactionCount : 0;
  const highestExpense = expenses.length
    ? Math.max(...expenses.map(e => e.amount))
    : 0;
  const lowestExpense = expenses.length
    ? Math.min(...expenses.map(e => e.amount))
    : 0;

  const categories = new Map<
    ExpenseCategory,
    { amount: number; count: number }
  >();
  const payments = new Map<PaymentMode, { amount: number; count: number }>();
  const vendors = new Map<string, { amount: number; count: number }>();
  const months = new Map<string, { amount: number; count: number }>();

  for (const expense of expenses) {
    const category = categories.get(expense.category) ?? {
      amount: 0,
      count: 0,
    };
    category.amount += expense.amount;
    category.count += 1;
    categories.set(expense.category, category);

    const payment = payments.get(expense.paymentMode) ?? {
      amount: 0,
      count: 0,
    };
    payment.amount += expense.amount;
    payment.count += 1;
    payments.set(expense.paymentMode, payment);

    if (expense.vendor) {
      const vendor = vendors.get(expense.vendor) ?? { amount: 0, count: 0 };
      vendor.amount += expense.amount;
      vendor.count += 1;
      vendors.set(expense.vendor, vendor);
    }

    const key = `${expense.expenseDate.getFullYear()}-${String(expense.expenseDate.getMonth() + 1).padStart(2, '0')}`;
    const month = months.get(key) ?? { amount: 0, count: 0 };
    month.amount += expense.amount;
    month.count += 1;
    months.set(key, month);
  }

  const categoryReports: CategoryReport[] = Array.from(categories.entries())
    .map(([category, value]) => ({
      category,
      amount: value.amount,
      count: value.count,
      percentage: totalExpense ? (value.amount / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const paymentReports: PaymentReport[] = Array.from(payments.entries())
    .map(([paymentMode, value]) => ({
      paymentMode,
      amount: value.amount,
      count: value.count,
      percentage: totalExpense ? (value.amount / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const vendorReports: VendorReport[] = Array.from(vendors.entries())
    .map(([vendor, value]) => ({
      vendor,
      amount: value.amount,
      count: value.count,
    }))
    .sort((a, b) => b.amount - a.amount);

  const monthlyReports: MonthlyReport[] = Array.from(months.entries())
    .map(([month, value]) => ({
      month,
      amount: value.amount,
      count: value.count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    summary: {
      totalExpense,
      transactionCount,
      averageExpense,
      highestExpense,
      lowestExpense,
    },
    categories: categoryReports,
    payments: paymentReports,
    vendors: vendorReports,
    monthly: monthlyReports,
    expenses,
  };
}
