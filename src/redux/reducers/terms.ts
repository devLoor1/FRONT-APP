import { createSlice } from '@reduxjs/toolkit';
import { AcceptNewTerms, GetNewTerms, VerifyNewTerms } from '@/services/terms';
import { VerifyNewTemsResponse } from '@/models/terms/verifyNewTems.response';
import { GetNewTemsResponse } from '@/models/terms/getNewTems.response';

const initialState = {
  loading: false,
  loadingContent: false,
  requestError: <null | string>null,
  verifyNewTerms: <VerifyNewTemsResponse | null>null,
  newTerms: <GetNewTemsResponse | null>null,
  acceptTerms: <boolean | null>null,
};

const termsSlice = createSlice({
  name: 'terms',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(VerifyNewTerms.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(VerifyNewTerms.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.verifyNewTerms = payload;
          }
        }
      })
      .addCase(GetNewTerms.pending, state => {
        state.loadingContent = true;
        state.requestError = null;
      })
      .addCase(GetNewTerms.fulfilled, (state, { payload }) => {
        state.loadingContent = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.newTerms = payload;
          }
        }
      })
      .addCase(AcceptNewTerms.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(AcceptNewTerms.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.acceptTerms = payload;
          }
        }
      });
  },
});

export const { reset } = termsSlice.actions;
export default termsSlice.reducer;
