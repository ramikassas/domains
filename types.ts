export interface Lead {
  companyName: string;
  websiteUrl: string;
  specialization: string;
  officialEmail: string | null;
  decisionMakerName: string | null;
  decisionMakerEmail: string | null;
  matchReason: string;
  sourceType: 'Similar Domain' | 'Competitor' | 'Partial Match' | 'Industry Match';
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  results: Lead[];
  hasSearched: boolean;
}
