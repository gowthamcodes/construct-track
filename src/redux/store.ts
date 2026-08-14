import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import expenseFilterReducer from './expense/expenseFilterSlice';
import siteReducer from './site/siteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenseFilter: expenseFilterReducer,
    site: siteReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
