import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthResponse } from "@/models-old/auth/auth.response";
import api from "./api";
import { NewcellRequest } from "@/models-old/auth/newphone.request";
import apiPublic from "../services-old/apiPublic";
import { MeResponse } from "@/models/user/me.response";

export const getMe = async () => {
  const response = await apiPublic.post<MeResponse>("/auth/investor/me");
  return response.data.data;
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
