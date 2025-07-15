export type SummaryResponse = {
  taxaMediaAa: number;
  taxaMediaAm: number;
  tir: number | null;
  totalCashback: number;
  totalDepositado: number;
  totalEmAtraso: number;
  totalInvestido: number;
  totalReceber: number;
  totalRecebido: number;
  totalSaquesRealizados: number;
  totalRecebidoRecompra: number;
  recebidos30Dias: number;
  rentabilidade30Dias: number;
  quantidadeOportunidades: number;
  investimentsDetail: {
    lucro: number;
    totalReceber: number;
    valorInvestido: number;
  };
};
