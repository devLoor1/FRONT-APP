import { handleAnalyticsUserProfile } from "@/helpers/analytics";
import api from "./api";
import {
  AuthRequest,
  AuthResponse,
  LogoutResponse,
  RecoverRequest,
  RecoverResponse,
  RegisterRequest,
} from "@/models/auth";
import AuthStorage from "@/storages/auth-storage";
import { formatPersonType, formatPhone } from "@/utils/formatters";

export const postRecover = async (request: RecoverRequest) => {
  const response = await api.post<RecoverResponse>(
    `/auth/investor/recover`,
    request
  );

  return response.data;
};

export const postLogin = async (request: AuthRequest) => {
  const response = await api.post<AuthResponse>(
    `/app/onboarding/login`,
    request
  );

  const { token } = response.data.data;
  api.defaults.headers.Authorization = `Bearer ${token}`;
  await AuthStorage.SetPrivateToken(token);

  handleAnalyticsUserProfile("signIn");

  return response.data;
};

export const postLogout = async () => {
  const response = await api.post<LogoutResponse>(`/app/onboarding/logout`);

  return response.data;
};

export const postRegister = async (request: RegisterRequest) => {
  let body = {
    ...request,
    phone: formatPhone(request.phone || ""),
    type: formatPersonType(request.type || ""),
  };

  const response = await api.post<AuthResponse>(
    `/app/onboarding/register`,
    body
  );

  return response.data;
};

export const deleteInvestor = async () => {
  const response = await api.delete(`/app/investors`);

  return response.data;
};
