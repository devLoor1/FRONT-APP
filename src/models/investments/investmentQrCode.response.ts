export type InvestmentQrCodeResponse = {
  data: Data;
};

export type Data = {
  id: number;
  value: number;
  expires_at: Date;
  created_at: Date;
  status: string;
  code: string;
  investment: Investment;
};

export type Investment = {
  id: number;
  status: string;
  opportunity: Opportunity;
  refund: Refund;
};

export type Opportunity = {
  id: number;
  name: string;
};

export type Refund = {};
