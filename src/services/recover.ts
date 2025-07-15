import api from "./api";
import { RecoverRequest, RecoverResponse } from "@/models/auth";

export const postRecover = async (request: RecoverRequest) => {
  const response = await api.post<RecoverResponse>(
    `/auth/investor/recover`,
    request
  );

  return response.data;
};
