import { InvestmentRequest } from "@/models/investments/investment.request";
import api from "./api";
import { InvestmentResponse } from "@/models/investments/investment.response";
import { InvestmentQrCodeResponse } from "@/models/investments/investmentQrCode.response";

export const getTotalInvestments = async () => {
  const response = await api.get<{ data: { total_invested: number } }>(
    "/investors/investments/current-year/total-invested"
  );

  return response.data.data;
};

export const postInvestments = async (data: InvestmentRequest) => {
  const response = await api.post<InvestmentResponse>(
    "/investors/investments",
    data
  );

  return response.data.data;
};

export const getInvestmentQrCode = async (investmentId: number) => {
  const response = await api.get<InvestmentQrCodeResponse>(
    `/investors/qr-codes/${investmentId}`
  );

  return response.data.data;
};
