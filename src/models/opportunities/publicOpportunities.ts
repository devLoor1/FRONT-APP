export type ListPublicOpportunitiesResponse = {
  idOpportunity: number;
  operationMarket: string;
  rating: string;
  hasRepurchase: boolean;
  hasWarranty: boolean;
  hasPropertyGuarantee: boolean;
  paymentDeadlineInDays: number;
  annualProfitabilityRate: number;
  paymentType: string;
}[];
