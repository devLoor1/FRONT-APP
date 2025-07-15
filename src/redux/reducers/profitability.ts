import { createSlice } from '@reduxjs/toolkit';
import { getProfitability } from '@/services-old/profitability';

const initialState = {
  profitabilityStatus: < any | null>null,
  loading: false,
  requestError: <null | string>null,
};

const resultSlice = createSlice({
  name: 'profitability',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(getProfitability.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.profitabilityStatus = null;
      })
      .addCase(getProfitability.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.profitabilityStatus = payload;
          }
        }
      });
  },
});

export const { reset } = resultSlice.actions;
export default resultSlice.reducer;
