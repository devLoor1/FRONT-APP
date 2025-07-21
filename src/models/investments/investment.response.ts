export type InvestmentResponse = {
  message: string;
  data: Data;
};

export type Data = {
  id: number;
  status: string;
  qr_code: QrCode;
};

export type QrCode = {
  id: number;
  code: string;
  status: string;
  expires_at: Date;
  created_at: Date;
};
