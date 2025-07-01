export type DailySummaryResponse = {
  hasTransactions: boolean;
  fromDate: string;
  transactions: {
    borrower: string;
    value: number;
    opportunity: string;
    date: string;
    description: string;
    formattedOpportunity: string;
    firstLineDescription: string;
    secondLineDescription: string;
  }[];
};
