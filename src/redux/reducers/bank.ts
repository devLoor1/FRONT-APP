import { createSlice } from '@reduxjs/toolkit';
import { ChangeBank, GetBank } from '@/services-old/bank';
import { GetBankResponse } from '@/models/user/bank.response';

const initialState = {
  bank: <GetBankResponse | null>null,
  changeBankStatus: <boolean | null>null,
  loading: false,
  loadingConfirm: false,
  requestError: <null | string>null,
};

const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    resetBankData: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetBank.pending, state => {
        state.requestError = null;
        state.loading = true;
      })
      .addCase(GetBank.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.bank = <GetBankResponse>payload;
          }
        }
      })
      .addCase(ChangeBank.pending, state => {
        state.loadingConfirm = true;
        state.requestError = null;
        state.changeBankStatus = null;
      })
      .addCase(ChangeBank.fulfilled, (state, { payload }) => {
        state.loadingConfirm = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.changeBankStatus = payload;
          }
        }
      });
  },
});

export const { resetBankData } = bankSlice.actions;
export default bankSlice.reducer;
