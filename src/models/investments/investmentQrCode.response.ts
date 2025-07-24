import { InvestmentStatus } from "./investment.response";

export type InvestmentQrCodeResponse = {
  data: Data;
};

export type Data = {
  id: number;
  value: number;
  expires_at: Date;
  created_at: Date;
  status: keyof typeof InvestmentStatus;
  code: string;
  investment: Investment;
};

export type Investment = {
  id: number;
  status: keyof typeof InvestmentStatus;
  opportunity: Opportunity;
  refund: Refund;
};

export type Opportunity = {
  id: number;
  name: string;
};

export type Refund = {};
