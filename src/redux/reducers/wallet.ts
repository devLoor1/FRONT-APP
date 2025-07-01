import { createSlice } from '@reduxjs/toolkit';
import { DebitResponse } from '@/models/investiment/debit.response';
import { ReceivedInterestGraphResponse } from '@/models/investiment/receivedInterestGraph.response';
import { SummaryResponse } from '@/models/investiment/summary.response';
import { WalletResponse } from '@/models/investiment/wallet.response';
import {
  GetDebitSummary,
  GetSummary,
  GetInterestReceivedGraph,
  GetWalletResume,
  GetQtdInvestments
} from '@/services/wallet';

const initialState = {
  summary: <SummaryResponse | null>null,
  resume: <WalletResponse | null>null,
  debit: <DebitResponse | null>null,
  qtdInvestments: <number | null>null,
  graph: <ReceivedInterestGraphResponse[] | null>null,
  loadingSummary: true,
  loadingResume: false,
  loadingDebit: false,
  loadingGraph: false,
  loadingInvestments: false,
  requestError: <null | string>null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetSummary.pending, state => {
        state.loadingSummary = true;
        state.summary = null;
      })
      .addCase(GetSummary.fulfilled, (state, { payload }) => {
        state.loadingSummary = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.summary = payload;
          }
        }
      })
      .addCase(GetWalletResume.pending, state => {
        state.loadingResume = true;
        state.resume = null;
      })
      .addCase(GetWalletResume.fulfilled, (state, { payload }) => {
        state.loadingResume = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.resume = payload;
          }
        }
      })
      .addCase(GetDebitSummary.pending, state => {
        state.loadingDebit = true;
        state.debit = null;
      })
      .addCase(GetDebitSummary.fulfilled, (state, { payload }) => {
        state.loadingDebit = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.debit = payload;
          }
        }
      })
      .addCase(GetInterestReceivedGraph.pending, state => {
        state.loadingGraph = true;
        state.graph = null;
      })
      .addCase(GetInterestReceivedGraph.fulfilled, (state, { payload }) => {
        state.loadingGraph = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.graph = payload;
          }
        }
      })
      .addCase(GetQtdInvestments.pending, state => {
        state.loadingInvestments = true;
        state.qtdInvestments = null;
      })
      .addCase(GetQtdInvestments.fulfilled, (state, { payload }) => {
        state.loadingInvestments = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.qtdInvestments = payload.quantityInvestment;
          }
        }
      });
  },
});

export const { reset } = walletSlice.actions;
export default walletSlice.reducer;
