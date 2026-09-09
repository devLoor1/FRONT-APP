import { createAsyncThunk } from "@reduxjs/toolkit";
import qs from "querystring";
import { CodeRequest } from "@/models/opportunities/code.request";
import { OpportunitiesRequest } from "@/models/opportunities/opportunities.request";
import { OpportunitiesResponse } from "@/models/opportunities/opportunities.response";
import { SendCodeRequest } from "@/models/opportunities/sendCode.request";
import api from "./api";
import { OpportunityDetailsResponse } from "@/models/opportunities/opportunityDetails.response";
import { OpportunityPix } from "@/models/opportunities/pix";

export const getOpportunities = async (params: OpportunitiesRequest) => {
  const response = await api.get<OpportunitiesResponse>(
    `/app/investors/opportunities`,
    {
      params,
      paramsSerializer: (params) => qs.stringify(params),
    }
  );

  return response.data;
};

export const getOpportunity = async (id: number) => {
  const response = await api.get<OpportunityDetailsResponse>(
    `/app/investors/opportunities/${id}`
  );

  return response.data.data;
};

export const getOpportunityPix = async (id: number) => {
  const response = await api.get<{ data: OpportunityPix }>(
    `/app/investors/investments/opportunities/${id}/pix`
  );

  return response.data.data;
};

export const GetCode = createAsyncThunk(
  "opportunities/getCode",
  async (request: CodeRequest) => {
    const response = await api
      .post(`/mfa/identifier/v2/secure/transaction`, request)
      .then(() => true)
      .catch((error) => {
        return error.response.data;
      });
    return response;
  }
);

export const SendCode = createAsyncThunk(
  "opportunities/SendCode",
  async ({ code, reason }: SendCodeRequest) => {
    const response = await api
      .patch(`/mfa/identifier/v2/secure/transaction/${code}`, { reason })
      .then(() => true)
      .catch((error) => {
        return error.response.data;
      });
    return response;
  }
);
