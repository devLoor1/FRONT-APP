export type InvestimentDetailResponse = {
  percParcelasPagas: number;
  percParcelasPendentes: number;
  percParcelasAtrasadas: number;
  totalParcelas: number;
  parcelas: {
    dataVencimento: string;
    dataPagamento: string;
    descricaoStatusParcela: string;
    idStatusParcela: number;
    juros: number;
    numeroParcela: number;
    totalParcelas: number;
    valor: number;
    valorPrincipal: number;
  }[];
};
