import { useMemo } from 'react';
import { useFilteredExpenses } from '../expenses/useFilteredExpenses';
import { generateExpenseReport } from '../../services/reports/ReportService';

export function useExpenseReport(ownerId?: string, siteId?: string) {
  const { expenses, isLoading, isError, refetch } = useFilteredExpenses(
    ownerId,
    siteId,
  );
  const report = useMemo(() => generateExpenseReport(expenses), [expenses]);
  return { report, isLoading, isError, refetch };
}
