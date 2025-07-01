import { createSlice } from '@reduxjs/toolkit';
import { CompanyDebtResponse } from '@/models/opportunities/companyDebt.response';
import { DebtEvolutionResponse } from '@/models/opportunities/debtEvolution.response';
import { FinancialDataResponse } from '@/models/opportunities/financialData.response';
import { OpportunitiePJResponse } from '@/models/opportunities/opportunitiePJ.response';
import { RatingResponse } from '@/models/opportunities/rating.response';
import { RevenueResponse } from '@/models/opportunities/revenue.response';
import {
  GetCompanyDebt,
  GetDebtEvolution,
  GetFinancialData,
  GetOpportunitiePJ,
  GetRating,
  GetRevenue,
} from '@/services/opportunitiePJ';

const initialState = {
  opportunitieDetail: <OpportunitiePJResponse | null>null,
  loading: false,
  financialData: <FinancialDataResponse | null>null,
  loadingFinancial: false,
  ratingList: <RatingResponse | null>null,
  loadingRating: false,
  companyDebt: <CompanyDebtResponse | null>null,
  loadingCompanyDebt: false,
  revenue: <RevenueResponse | null>null,
  loadingRevenue: false,
  debtEvolution: <DebtEvolutionResponse | null>null,
  loadingDebtEvolution: false,
  requestError: <null | string>null,
};

const opportunitiePJSlice = createSlice({
  name: 'opportunitiePJ',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetOpportunitiePJ.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.opportunitieDetail = null;
      })
      .addCase(GetOpportunitiePJ.fulfilled, (state, { payload, meta }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.opportunitieDetail = { idOpportunity: meta.arg.idOpportunity, ...payload };
          }
        }
      })
      .addCase(GetFinancialData.pending, state => {
        state.loadingFinancial = true;
        state.requestError = null;
        state.financialData = null;
      })
      .addCase(GetFinancialData.fulfilled, (state, { payload }) => {
        state.loadingFinancial = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.financialData = payload;
          }
        }
      })
      .addCase(GetRating.pending, state => {
        state.loadingRating = true;
        state.requestError = null;
        state.ratingList = null;
      })
      .addCase(GetRating.fulfilled, (state, { payload }) => {
        state.loadingRating = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.ratingList = payload;
          }
        }
      })
      .addCase(GetCompanyDebt.pending, state => {
        state.loadingCompanyDebt = true;
        state.requestError = null;
        state.companyDebt = null;
      })
      .addCase(GetCompanyDebt.fulfilled, (state, { payload }) => {
        state.loadingCompanyDebt = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.companyDebt = payload;
          }
        }
      })
      .addCase(GetRevenue.pending, state => {
        state.loadingRevenue = true;
        state.requestError = null;
        state.revenue = null;
      })
      .addCase(GetRevenue.fulfilled, (state, { payload }) => {
        state.loadingRevenue = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.revenue = payload;
          }
        }
      })
      .addCase(GetDebtEvolution.pending, state => {
        state.loadingDebtEvolution = true;
        state.requestError = null;
        state.debtEvolution = null;
      })
      .addCase(GetDebtEvolution.fulfilled, (state, { payload }) => {
        state.loadingDebtEvolution = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.debtEvolution = payload;
          }
        }
      });
  },
});

export const { reset } = opportunitiePJSlice.actions;
export default opportunitiePJSlice.reducer;
