export type RevenueResponse = {
  revenueDetails: {
    type: string;
    description: string;
  }[];
  revenues: {
    date: string;
    value: number;
  }[];
};
