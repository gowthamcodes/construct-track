export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Expenses: undefined;
  Reports: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  AddExpense: { expenseId?: string } | undefined;
};
