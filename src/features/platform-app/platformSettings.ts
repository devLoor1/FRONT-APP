import api from "@/services/api";
import type { InvestorPlatformResponse } from "./platformValue";

export async function getInvestorPlatformSettings(): Promise<InvestorPlatformResponse> {
  const response = await api.get<InvestorPlatformResponse>("/investor/platform");
  return response.data;
}
