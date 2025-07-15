import { createSlice } from "@reduxjs/toolkit";
import { RisksResponse } from "@/models/auth/risks.response";
import { GetNewTemsResponse } from "@/models-old/terms/getNewTems.response";
import { DailySummaryResponse } from "@/models/auth/dailySummary.response";
import { ConfirmDailySummaryResponse } from "@/models/auth/confirmDailySummary.response";

const initialState = {
  publicToken: <string | null>null,
  riskList: <RisksResponse | null>null,
  loading: false,
  rAgreeRiskInvest: <null | boolean>null,
  rDailySummary: <DailySummaryResponse | null>null,
  rConfirmDailySummary: <ConfirmDailySummaryResponse | null>null,
  requestError: <null | string>null,
  publicTerms: <GetNewTemsResponse | null>null,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    reset: () => initialState,
  },
});

export const { reset } = commonSlice.actions;
export default commonSlice.reducer;
