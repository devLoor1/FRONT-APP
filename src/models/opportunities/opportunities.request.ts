export type OpportunitiesRequest = {
  page?: number;
  limit?: number;
  opportunityInvested?: boolean;
  codeOpportunity?: string;
  shortOrder?: string;
  filter?: string | Record<string, string | string[]>;
  searchQuery?: string;
  idOpportunity?: number;
};
