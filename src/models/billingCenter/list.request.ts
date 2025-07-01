export type BillingListRequest = {
  pageNumber: number;
  pageSize: number;
  opportunityBillingOrder?:
    | 'maior_atraso'
    | 'maior_atraso_desc'
    | 'maior_valor'
    | 'maior_valor_desc';
};
