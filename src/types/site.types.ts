export type SiteStatus = 'planning' | 'active' | 'paused' | 'completed';

export interface ConstructionSite {
  id: string;
  ownerId: string;
  name: string;
  location: string | null;
  totalBudget: number;
  startDate: Date;
  expectedCompletionDate: Date | null;
  status: SiteStatus;
}
