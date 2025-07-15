export type WalletResponse = {
  /* availableBalance: number;
  promotionalBalance: number;
  investedAmount: number;
  expectedProfit: number;
  totalInterestReceived: number;
  totalValueToReceive: number;
  totalReceived: number;
  tir: number; */

  data: {
    estimated_patrimony: number;
    total_invested: number;
    total_investments: number;
    total_received: number;
    images: [
      {
        image: string;
        created_at: string;
      }
    ];
    segments: [
      {
        name: string;
        color: string;
        total_invested: number;
        total_investments: number;
        total_percentage: number;
      }
    ];
    investments: [
      {
        month: number;
        total: number;
      }
    ];
  };
};
