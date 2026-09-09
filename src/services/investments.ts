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
    "/app/investors/investments/current-year/total-invested"
  );

  return response.data.data;
};

export const getInvestments = async (params: OpportunitiesRequest) => {
  const response = await api.get<InvestmentsResponse>(
    `/app/investors/investments`,
    {
      params,
      paramsSerializer: (params) => qs.stringify(params),
    }
  );

  return response.data;
};

export const postInvestments = async (data: InvestmentRequest) => {
  const response = await api.post<InvestmentResponse>(
    "/app/investors/investments",
    {
      opportunity_id: data.opportunity_id,
      quota_quantity: data.quota_quantity,
      declaration: data.declaration,
      other_crowdfunding_platforms: data.other_crowdfunding_platforms,
      anonymous: data.anonymous,
      pix: data.pix,
    }
  );
  return response.data.data;
};

export const getInvestmentQrCode = async (investmentId: number) => {
  const response = await api.get<InvestmentQrCodeResponse>(
    `/app/investors/qr-codes/${investmentId}`
  );
  return response.data.data;
};

export const getInvestmentContract = async (data: {
  opportunity_id: number;
  quota_quantity: number;
}) => {
  const response = await api.post<Blob>(
    "/app/investors/investments/contract",
    data,
    { responseType: "blob" }
  );

  return response.data;
};
