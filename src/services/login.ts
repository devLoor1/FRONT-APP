import api from "./api";
import Debug from "@/helpers/debug";
import LogRocketHelper from "@/helpers/logRocket";
import { LoginRequest, AuthResponse } from "@/models/auth";
import AuthStorage from "@/storages/auth-storage";
import { handleAnalyticsUserProfile } from "@/helpers/analytics";

export const postLogin = async (request: LoginRequest) => {
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
