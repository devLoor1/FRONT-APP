export type CodeResponse = {
  description: string;
  hasCode: boolean;
  noRecommendation: {
    investedAmount: number;
    investmentAmountMin: number;
    receiveCodeAmount: number;
  } | null;
  recommendation: {
    amountReceived: number;
    code: string;
    percentage: number;
    periodMonth: number;
    recommendedCustomer: number;
  } | null;
};
