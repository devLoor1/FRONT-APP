import { createSlice } from '@reduxjs/toolkit';
import {
  AgreeRiskInvest,
  ConfirmDailySummary,
  GetDailySummary,
  GetPublicTerms,
  GetPublicToken,
  GetRisks,
} from '@/services/common';
import { AuthResponse } from '@/models/auth/auth.response';
import AuthStorage from '@/storages/auth-storage';
import { RisksResponse } from '@/models/auth/risks.response';
import { GetNewTemsResponse } from '@/models/terms/getNewTems.response';
import { DailySummaryResponse } from '@/models/auth/dailySummary.response';
import { ConfirmDailySummaryResponse } from '@/models/auth/confirmDailySummary.response';

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
  name: 'common',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetPublicToken.fulfilled, (state, { payload }) => {
        if (payload) {
          const { accessToken } = <AuthResponse>payload;
          if (!payload.message) {
            state.publicToken = accessToken;
          }
          if (accessToken) {
            AuthStorage.SetPublicToken(accessToken);
          }
        }
      })
      .addCase(GetRisks.pending, state => {
        state.loading = true;
        state.riskList = null;
        state.requestError = null;
      })
      .addCase(GetRisks.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.riskList = payload;
          }
        }
      })
      .addCase(GetPublicTerms.pending, state => {
        state.requestError = null;
      })
      .addCase(GetPublicTerms.fulfilled, (state, { payload }) => {
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.publicTerms = payload;
          }
        }
      })
      .addCase(AgreeRiskInvest.pending, state => {
        state.requestError = null;
      })
      .addCase(AgreeRiskInvest.fulfilled, (state, { payload }) => {
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.rAgreeRiskInvest = payload;
          }
        }
      })
      .addCase(GetDailySummary.pending, state => {
        state.requestError = null;
        state.rDailySummary = null;
        state.loading = true;
      })
      .addCase(GetDailySummary.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.rDailySummary = payload;
          }
        }
      })
      .addCase(ConfirmDailySummary.pending, state => {
        state.requestError = null;
        state.rConfirmDailySummary = null;
      })
      .addCase(ConfirmDailySummary.fulfilled, (state, { payload }) => {
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.rConfirmDailySummary = payload;
          }
        }
      });
  },
});

export const { reset } = commonSlice.actions;
export default commonSlice.reducer;
