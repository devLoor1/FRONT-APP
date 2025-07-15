export type BillingListResponse = {
  id: number;
  idOpportunity: number;
  codeOpportunity: string;
  valorAtraso: number;
  diasAtraso: number;
  status: string;
  tomador: string;
}[];
