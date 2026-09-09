import { createAsyncThunk } from "@reduxjs/toolkit";
import { DebitResponse } from "@/models-old/investiment/debit.response";
import { SummaryResponse } from "@/models-old/investiment/summary.response";
import api from "../services/api";
import { ReceivedInterestGraphResponse } from "@/models-old/investiment/receivedInterestGraph.response";
import { WalletResponse } from "@/models-old/investiment/wallet.response";

export const GetDebitSummary = createAsyncThunk(
  "wallet/debitSummary",
  async () => {
    const response = await api
      .get(`/investment/invest/bad/debit/v3`)
      .then((r): DebitResponse => r.data)
      .catch((error) => {
        return error.response.data;
      });
    return response;
  }
);

export const GetSummary = createAsyncThunk("wallet/summary", async () => {
  const response = await api
    .get(`/investment/calc/resume/wallet`)
    .then((r): SummaryResponse => r.data)
    .catch((error) => {
      return error.response.data;
    });
  return response;
});

export const getWalletResume = async () => {
  const response = await api.get<WalletResponse>("/app/investors/home");

  return response.data.data;
};

export const GetInterestReceivedGraph = createAsyncThunk(
  "wallet/received",
  async () => {
    const response = await api
      .get(`/investment/calc/graph/received`)
      .then((r): ReceivedInterestGraphResponse[] => r.data)
      .catch((error) => {
        return error.response.data;
      });
    return response;
  }
);

export const GetQtdInvestments = createAsyncThunk(
  "wallet/investment",
  async () => {
    const response = await api
      .get(`investment/calc/quantity/investment`)
      .then((r): number => r.data)
      .catch((error) => {
        return error.response.data;
      });
    return response;
  }
);

export const GetContractPDF = createAsyncThunk(
  "wallet/pdf",
  async (id: number) => {
    const response = await api
      .get(`/investment/invest/link/cccb/${id}`)
      .then((r): string => r.data.url)
      .catch((error) => {
        return error.response.data;
      });

    return response;
  }
);
