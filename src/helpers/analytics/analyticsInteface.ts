export interface appsflyerAnalyticsInterface {
  eventName?: string;
  pageName?: string;
  generalData?: {
    cod_oportunidade?: string;
    risco_oportunidade?: string;
    valor_cota?: number;
    quantidade_cotas?: number;
    valor_investido?: number;
  };
  exclusiveData?: {
    cod_oportunidade?: string;
    risco_oportunidade?: string;
    valor_cota?: number;
    quantidade_cotas?: number;
    valor_investido?: number;
  };
}

export interface firebaseAnalyticsInterface {
  eventName?: string;
  pageName?: string;
  generalData?: any;
  exclusiveData?: {
    cod_oportunidade?: string;
    risco_oportunidade?: string;
    valor_cota?: number;
    quantidade_cotas?: number;
  };
}
