import { OpportunitiesResponse } from '../opportunities/opportunities.response';

export type InvestTabsTypes = {
  Opportunities: {
    opportunitie: OpportunitiesResponse[0];
  };
  Invest: {
    opportunitie: OpportunitiesResponse[0];
    topColor: string;
    maxQuotaToInvest: number;
    paramsRequest?: {
      creditRisk: string;
      codeOpportunity: string;
      shortOrder: string;
    };
    resetOpportunities?(): void;
  };
  OpportunitiesMoreDetailPJ: {
    opportunitie: OpportunitiesResponse[0];
    handleInvest?(): string | null;
  };
};
