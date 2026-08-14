export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (ownerId: string, siteId: string) =>
    [...expenseKeys.lists(), ownerId, siteId] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (expenseId: string) => [...expenseKeys.details(), expenseId] as const,
};
