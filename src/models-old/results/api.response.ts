import { ResponseMonth } from "./month.response";

export type ApiResponse = {
  year: number;
  totalVariation: number;
  totalYield: number;
  months: ResponseMonth[]; 
};