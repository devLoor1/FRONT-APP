import { createAsyncThunk } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import { AuthResponse } from "@/models/auth/auth.response";
import AuthStorage from "@/storages/auth-storage";
import api from "./api";
import { RisksResponse } from "@/models/auth/risks.response";
import { GetNewTemsResponse } from "@/models-old/terms/getNewTems.response";
import apiPublic from "../services-old/apiPublic";
import { AgreeRiskInvestRequest } from "@/models/auth/agreeRiskInvest.request";
import { DailySummaryResponse } from "@/models/auth/dailySummary.response";
import { ConfirmDailySummaryResponse } from "@/models/auth/confirmDailySummary.response";
import { Segments } from "@/models/opportunities/segments.response";
import { Country } from "@/models/common/country";

export const GetPublicToken = createAsyncThunk(
  "common/getPublicToken",
  async () => {
    const request = { scopes: "", grantType: "" };
    request.scopes = Constants.expoConfig?.extra?.env.publicScopesAuth;
    request.grantType = Constants.expoConfig?.extra?.env.publicGrantTypeAuth;

    const response = await apiPublic
      .post(`/authorize/auth`, request)
      .then((r): AuthResponse => r.data)
      .catch((error) => {
        return error.response.data;
      });

    return response;
  }
);

export const GetRisks = createAsyncThunk("common/GetRisks", async () => {
  const response = await apiPublic
    .get(`investment/opportunitypublic/risks`)
    .then((r): RisksResponse => r.data)
    .catch((error) => {
      return error.response.data;
    });
  return response;
});

export const GetPublicTerms = createAsyncThunk(
  "terms/GetPublicTerms",
  async () => {
    const token = await AuthStorage.GetPublicToken();
    const response = await api
      .get(`/agreements/term/new/v2?profile=1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r): GetNewTemsResponse => r.data)
      .catch((error) => {
        return error.response.data;
      });
    return response;
  }
);

export const AgreeRiskInvest = createAsyncThunk(
  "common/AgreeRiskInvest",
  async ({ type, check }: AgreeRiskInvestRequest) => {
    const params = `type=${type}&check=${check}`;
    const response = await api
      .post(`/agreements/agree/investor/profile?${params}`)
      .then(() => true)
      .catch((error) => {
        return error.response.data;
      });
    return response;
  }
);

export const GetDailySummary = createAsyncThunk(
  "common/GetDailySummary",
  async () => {
    const response = await api
      .get(`/investment/opportunity/daily-summary`)
      .then((r): DailySummaryResponse => r.data)
      .catch((error) => {
        return error.response.data;
      });
    return response;
  }
);

export const ConfirmDailySummary = createAsyncThunk(
  "common/ConfirmDailySummary",
  async () => {
    const response = await api
      .patch(`/signup/user/confirm-activity`)
      .then((r): ConfirmDailySummaryResponse => r.data)
      .catch((error) => {
        return error.response.data;
      });
    return response;
  }
);

export const getSegments = async () => {
  const response = await api.get<Segments>("/segments");

  return response.data.data;
};
export const getCountries = async () => {
  const response = await api.get<{ data: Country[] }>("/countries");

  return response.data.data;
};
