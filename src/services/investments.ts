import qs from "querystring";
import { InvestmentRequest } from "@/models/investments/investment.request";
import api from "./api";
import { InvestmentResponse } from "@/models/investments/investment.response";
import { InvestmentQrCodeResponse } from "@/models/investments/investmentQrCode.response";
import { OpportunitiesRequest } from "@/models/opportunities/opportunities.request";
import { OpportunitiesResponse } from "@/models/opportunities/opportunities.response";
import { InvestmentsResponse } from "@/models/investments/investments.response";

export const getTotalInvestments = async () => {
  const response = await api.get<{ data: { total_invested: number } }>(
    "/investors/investments/current-year/total-invested"
  );

  return response.data.data;
};

export const getInvestments = async (params: OpportunitiesRequest) => {
  const response = await api.get<InvestmentsResponse>(
    `/investors/investments`,
    {
      params,
      paramsSerializer: (params) => qs.stringify(params),
    }
  );

  return response.data;
};

export const postInvestments = async (data: InvestmentRequest) => {
  console.log(data);
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

export const getInvestmentContract = async (data: {
  opportunity_id: number;
  quota_quantity: number;
}) => {
  const response = await api.post<Blob>(
    "/investors/investments/contract/",
    data,
    { responseType: "blob" }
  );

  return response.data;
};
