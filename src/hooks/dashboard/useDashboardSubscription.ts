import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { dashboardRepository } from '../../repositories/DashboardRepository';
import { dashboardKeys } from './dashboardKeys';

export function useDashboardSubscription(ownerId?: string, siteId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!ownerId || !siteId) return;

    return dashboardRepository.subscribe(
      ownerId,
      siteId,
      summary =>
        queryClient.setQueryData(
          dashboardKeys.summary(ownerId, siteId),
          summary,
        ),
      error => console.error('[DashboardSubscription]', error),
    );
  }, [ownerId, siteId, queryClient]);
}
