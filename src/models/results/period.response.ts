export type PeriodSection = {
  year: number;
  totalVariation: string;
  totalYield: string;
  months: {
    month: string;
    variation: string;
    yield: string;
  }[];
};