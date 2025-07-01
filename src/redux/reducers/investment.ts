import { createSlice } from '@reduxjs/toolkit';
import { InvestimentDetailResponse } from '@/models/investiment/investimentDetail.response';
import { InvestimentsResponse } from '@/models/investiment/investiments.response';
import { RatingResponse } from '@/models/investiment/rating.response';
import { GetInvestimentDetail, GetInvestiments, GetRating } from '@/services/investment';

const initialState = {
  rating: <RatingResponse | null>null,
  listInvestiments: <InvestimentsResponse | null>null,
  investimentDetail: <InvestimentDetailResponse | null>null,
  loading: false,
  loadingRating: false,
  loadingList: false,
  loadingSummary: true,
  loadingDebit: false,
  requestError: <null | string>null,
  moreInvestiments: <boolean>true,
  finish: false
};

const investmentSlice = createSlice({
  name: 'investiment',
  initialState,
  reducers: {
    reset: () => initialState,
    resetListInvestiments: state => {
      state.listInvestiments = <InvestimentsResponse | null>null;
      state.loadingList = false;
      state.requestError = <null | string>null;
      state.moreInvestiments = <boolean>true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(GetRating.pending, state => {
        state.loadingRating = true;
        state.rating = null;
      })
      .addCase(GetRating.fulfilled, (state, { payload }) => {
        state.loadingRating = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.rating = <RatingResponse>payload;
          }
        }
      })
      .addCase(GetInvestiments.pending, state => {
        state.loadingList = true;
        state.listInvestiments = null;
        state.finish = false;
      })
      .addCase(GetInvestiments.fulfilled, (state, { payload }) => {
        state.loadingList = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else if (payload.length === 0) {
            state.moreInvestiments = false;
          } else {
            state.listInvestiments = <InvestimentsResponse>payload;
          }
        } else { 
          state.finish = true;
        }
      })
      .addCase(GetInvestimentDetail.pending, state => {
        state.loading = true;
        state.investimentDetail = null;
      })
      .addCase(GetInvestimentDetail.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.investimentDetail = <InvestimentDetailResponse>payload;
          }
        }
      });
  },
});

export const { reset, resetListInvestiments } = investmentSlice.actions;
export default investmentSlice.reducer;
