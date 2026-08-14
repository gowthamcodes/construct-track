export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: (ownerId: string, siteId: string) =>
    ['dashboard', 'summary', ownerId, siteId] as const,
};
