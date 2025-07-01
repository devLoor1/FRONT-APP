export type InvestimentsRequest = {
  pageNumber: number;
  pageSize: number;
  investmentWarranty?: 'has_warranty' | 'has_repurchase' | 'has_property_guarantee';
  investmentOrder?:
    | 'data_compra'
    | 'data_compra_desc'
    | 'total_pago'
    | 'total_pago_desc'
    | 'valor_investido'
    | 'valor_investido_desc';
  idOpportunity?: number;
  searchQuery?: string;
  filter?: string;
};
