import { InvestimentsResponse } from '../investiment/investiments.response';

export type InvestimentTabsTypes = {
  Investments: undefined;
  InvestmentDetail: {
    investiment: InvestimentsResponse[0];
  };
};
