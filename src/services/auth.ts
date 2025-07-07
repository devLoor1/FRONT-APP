import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthRequest } from "@/models/auth/auth.request";
import { AuthResponse } from "@/models/auth/auth.response";
import api from "./api";
import { NewcellRequest } from "@/models/auth/newphone.request";
import apiPublic from "./apiPublic";
import Debug from "@/helpers/debug";
import LogRocketHelper from "@/helpers/logRocket";
import { handleAnalyticsUserProfile } from "@/helpers/analytics";

export const login = async (request: AuthRequest) => {
  Debug.SetUser({ email: request.email });
  LogRocketHelper.SetUser({ email: request.email });
  const response = await apiPublic.post<AuthResponse>(
    "/auth/investor/login",
    request
  );
  const { token } = response.data.data;
  api.defaults.headers.Authorization = `Bearer ${token}`;

  handleAnalyticsUserProfile("sigIn", { Identity: token });
  return response.data;
};

export const GetNewDeviceCode = createAsyncThunk(
  "auth/getNewDeviceCode",
  async (request: NewcellRequest) => {
    const response = await api
      .post(`/mfa/identifier/change/device`, request)
      .then(() => true)
      .catch((error) => {
        return error.response.data;
      });

    return response;
  }
);

export const PostNewDeviceCode = createAsyncThunk(
  "auth/postNewDeviceCode",
  async ({ request, code }: any) => {
    const response = await api
      .patch(`/mfa/identifier/v2/change/device/${code}`, request)
      .then((r): AuthResponse => {
        const { accessToken } = r.data;
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        return r.data;
      })
      .catch((error) => {
        return error.response.data;
      });

    return response;
  }
);
