export type CompanyDebtResponse = {
  creditLines: {
    typeDebt: 'curtissimo_prazo' | 'curto_prazo' | 'longo_prazo';
    description: string;
    creditLinePercentage: number;
    creditLineValue: number;
  }[];
  debtDetails: {
    type: string;
    description: string;
  }[];
};
