export type BillingDetailResponse = {
  codeOpportunity: string;
  status: string;
  diasAtraso: number;
  valorAtraso: number;
  opportunitysDebtsDetails: {
    status: string;
    dataExecucao: string;
  }[];
};
