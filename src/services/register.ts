import api from "./api";
import Debug from "@/helpers/debug";
import LogRocketHelper from "@/helpers/logRocket";
import { RegisterRequest, AuthResponse } from "@/models/auth";
import { formatPhone, formatPersonType } from "@/utils/formatters";

export const postRegister = async (request: RegisterRequest) => {
  let body = {
    ...request,
    phone: formatPhone(request.phone || ''),
    type: formatPersonType(request.type || '')
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
