import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ExpenseCategory,
  ExpenseFilters,
  ExpenseSort,
  PaymentMode,
} from '../../types/expense.types';

const initialState: ExpenseFilters = {
  search: '',
  category: 'all',
  paymentMode: 'all',
  startDate: null,
  endDate: null,
  minAmount: null,
  maxAmount: null,
  sortBy: 'newest',
};

const expenseFilterSlice = createSlice({
  name: 'expenseFilter',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setCategory(state, action: PayloadAction<ExpenseCategory | 'all'>) {
      state.category = action.payload;
    },
    setPaymentMode(state, action: PayloadAction<PaymentMode | 'all'>) {
      state.paymentMode = action.payload;
    },
    setDateRange(
      state,
      action: PayloadAction<{ startDate: Date | null; endDate: Date | null }>,
    ) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setAmountRange(
      state,
      action: PayloadAction<{
        minAmount: number | null;
        maxAmount: number | null;
      }>,
    ) {
      state.minAmount = action.payload.minAmount;
      state.maxAmount = action.payload.maxAmount;
    },
    setSortBy(state, action: PayloadAction<ExpenseSort>) {
      state.sortBy = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setSearch,
  setCategory,
  setPaymentMode,
  setDateRange,
  setAmountRange,
  setSortBy,
  resetFilters,
} = expenseFilterSlice.actions;

export default expenseFilterSlice.reducer;
