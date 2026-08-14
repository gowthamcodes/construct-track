import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'construction-expense-manager',
});

export const storageKeys = {
  selectedSiteId: 'selectedSiteId',
  expenseFilters: 'expenseFilters',
};
