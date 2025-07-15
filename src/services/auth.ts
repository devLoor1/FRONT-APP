import { handleAnalyticsUserProfile } from "@/helpers/analytics";
import api from "./api";
import Debug from "@/helpers/debug";
import LogRocketHelper from "@/helpers/logRocket";
import {
  AuthRequest,
  AuthResponse,
  RecoverRequest,
  RecoverResponse,
  RegisterRequest,
} from "@/models/auth";
import { MeResponse } from "@/models/user/me.response";
import AuthStorage from "@/storages/auth-storage";
import { formatPersonType, formatPhone } from "@/utils/formatters";

export const getMe = async () => {
  const response = await api.get<MeResponse>("/auth/investor/me");
  return response.data.data;
};

export const postRecover = async (request: RecoverRequest) => {
  const response = await api.post<RecoverResponse>(
    `/auth/investor/recover`,
    request
  );

  return response.data;
};

export const postLogin = async (request: AuthRequest) => {
  Debug.SetUser({ email: request.email });
  LogRocketHelper.SetUser({ email: request.email });

  const response = await api.post<AuthResponse>(
    `/auth/investor/login`,
    request
  );

  const { token } = response.data.data;
  api.defaults.headers.Authorization = `Bearer ${token}`;
  await AuthStorage.SetPrivateToken(token);

  handleAnalyticsUserProfile("sigIn", { Identity: token });

  return response.data;
};

export const postRegister = async (request: RegisterRequest) => {
  let body = {
    ...request,
    phone: formatPhone(request.phone || ""),
    type: formatPersonType(request.type || ""),
  };

  if (request.full_name && request.email) {
    Debug.SetUser({
      email: request.email,
      name: request.full_name,
    });
    LogRocketHelper.SetUser({
      email: request.email,
      name: request.full_name,
    });
  }

  const response = await api.post<AuthResponse>(
    `/auth/investor/register`,
    body
  );

  return response.data;
};
