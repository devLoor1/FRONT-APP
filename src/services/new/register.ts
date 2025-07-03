import api from "../api";
import Debug from "@/helpers/debug";
import LogRocketHelper from "@/helpers/logRocket";
import { RegisterRequest } from "@/models/new/auth/register.request";

type RegisterResponse = { message: string; data: { token: string } };

export const postRegister = async (request: RegisterRequest) => {
  let body = { ...request };

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

  const response = await api.post<RegisterResponse>(
    `/auth/investor/register`,
    body
  );

  return response.data;
};
