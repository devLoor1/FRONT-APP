import { createSlice } from '@reduxjs/toolkit';
import { ActiveSatisfactionResponse } from '@/models/analytic/active.response';
import { ListPagesSatisfactionResponse } from '@/models/analytic/listPages.response';
import { ActiveSatisfaction, ListPagesSatisfaction, PostSatisfaction } from '@/services/analytic';

const initialState = {
  listPages: <ListPagesSatisfactionResponse | null>null,
  returnPostSatisfaction: <boolean | null>null,
  activeSatisfaction: <ActiveSatisfactionResponse | null>null,
  loading: false,
  loadingConfirm: false,
  requestError: <null | string>null,
};

const analyticSlice = createSlice({
  name: 'analytic',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(ListPagesSatisfaction.pending, state => {
        state.requestError = null;
        state.loading = true;
      })
      .addCase(ListPagesSatisfaction.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.listPages = payload;
          }
        }
      })
      .addCase(PostSatisfaction.pending, state => {
        state.loadingConfirm = true;
        state.requestError = null;
        state.returnPostSatisfaction = null;
      })
      .addCase(PostSatisfaction.fulfilled, (state, { payload }) => {
        state.loadingConfirm = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.returnPostSatisfaction = payload;
          }
        }
      })
      .addCase(ActiveSatisfaction.pending, state => {
        state.requestError = null;
        state.loading = true;
        state.activeSatisfaction = null;
      })
      .addCase(ActiveSatisfaction.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.activeSatisfaction = payload;
          }
        }
      });
  },
});

export const { reset } = analyticSlice.actions;
export default analyticSlice.reducer;
