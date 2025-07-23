export type InvestmentResponse = {
  message: string;
  data: InvestmentResponseData;
};

export type InvestmentResponseData = {
  id: number;
  status: keyof typeof InvestmentStatus;
  qr_code: QrCode;
};

export type QrCode = {
  id: number;
  code: string;
  status: string;
  expires_at: Date;
  created_at: Date;
};

export enum InvestmentStatus {
  waiting_payment = "Aguardado Pagamento",
}
