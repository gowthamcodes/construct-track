import { useQuery } from '@tanstack/react-query';
import { dashboardRepository } from '../../repositories/DashboardRepository';
import { dashboardKeys } from './dashboardKeys';

export function useDashboardSummary(ownerId?: string, siteId?: string) {
  return useQuery({
    queryKey: dashboardKeys.summary(ownerId ?? '', siteId ?? ''),
    queryFn: () =>
      ownerId && siteId
        ? dashboardRepository.getSummary(ownerId, siteId)
        : null,
    enabled: Boolean(ownerId && siteId),
  });
}
