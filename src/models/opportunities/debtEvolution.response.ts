export type DebtEvolutionResponse = {
  longTermPercent: number;
  shortTermPercent: number;
  longTermValue: number;
  shortTermValue: number;
  debtsDetails: {
    type: string;
    description: string;
  }[];
  debts: {
    date: string;
    value: number;
  }[];
};
