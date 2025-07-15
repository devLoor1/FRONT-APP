export type ExcerptResponse = {
  idTransaction?: number,
  created: string;
  description: string;
  typeOperation: string;
  typeTransaction: string;
  value: number;
  transactionOpportunity: {
    borrowerName: string;
    idOpportunity: number;
  };
}[];
