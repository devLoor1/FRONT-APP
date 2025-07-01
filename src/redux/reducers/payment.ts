import { createSlice } from '@reduxjs/toolkit';
import { WithdrawResponse } from '@/models/payment/withdraw.response';
import { SendPay, SendWithdraw } from '@/services/payment';

const initialState = {
  payStatus: <boolean | null>null,
  withdrawStatus: <WithdrawResponse | null>null,
  loading: false,
  requestError: <null | string>null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(SendPay.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.payStatus = null;
      })
      .addCase(SendPay.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.payStatus = payload;
          }
        }
      })
      .addCase(SendWithdraw.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.withdrawStatus = null;
      })
      .addCase(SendWithdraw.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.withdrawStatus = <WithdrawResponse>payload;
          }
        }
      });
  },
});

export const { reset } = paymentSlice.actions;
export default paymentSlice.reducer;
