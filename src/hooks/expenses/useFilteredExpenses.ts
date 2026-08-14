import { useMemo } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { useExpenses } from './useExpenses';
import { filterExpenses } from '../../utils/expenseFilters';

export function useFilteredExpenses(ownerId?: string, siteId?: string) {
  const filters = useAppSelector(state => state.expenseFilter);
  const query = useExpenses(ownerId, siteId);
  const expenses = useMemo(
    () => filterExpenses(query.data ?? [], filters),
    [query.data, filters],
  );

  return { ...query, expenses, filters };
}
