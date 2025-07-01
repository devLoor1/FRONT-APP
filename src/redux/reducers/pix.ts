import { createSlice } from '@reduxjs/toolkit';
import { BacenResponse } from '@/models/payment/bacen.response';
import { ConsultTaxPixResponse } from '@/models/payment/consultTaxPix.response';
import { PixResponse } from '@/models/payment/pix.response';
import { SendPixResponse } from '@/models/payment/sendPix.response';
import {
  ConsultTax,
  DeletePixKey,
  GetPix,
  RegisterNewPixKey,
  SendPix,
  VerifyBacen,
} from '@/services/pix';

const initialState = {
  statusSendPix: <SendPixResponse | null>null,
  pixList: <PixResponse | null>null,
  existKey: <false | BacenResponse | null>null,
  newKey: <boolean | null>null,
  deleteKey: <boolean | null>null,
  taxPix: <ConsultTaxPixResponse | null>null,
  loading: false,
  loadingList: false,
  requestError: <null | string>null,
};

const pixSlice = createSlice({
  name: 'pix',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetPix.pending, state => {
        state.loadingList = true;
        state.requestError = null;
        state.pixList = null;
      })
      .addCase(GetPix.fulfilled, (state, { payload }) => {
        state.loadingList = false;
        if (payload) {
          if (payload.message) {
          } else {
            state.pixList = <PixResponse>payload;
          }
        }
      })
      .addCase(VerifyBacen.pending, state => {
        state.loading = true;
        state.existKey = null;
        state.requestError = null;
      })
      .addCase(VerifyBacen.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
            state.existKey = false;
          } else {
            state.existKey = payload;
          }
        }
      })
      .addCase(RegisterNewPixKey.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.newKey = null;
      })
      .addCase(RegisterNewPixKey.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.newKey = payload;
          }
        }
      })
      .addCase(DeletePixKey.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.deleteKey = null;
      })
      .addCase(DeletePixKey.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.deleteKey = payload;
          }
        }
      })
      .addCase(SendPix.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.statusSendPix = null;
      })
      .addCase(SendPix.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.statusSendPix = <SendPixResponse>payload;
          }
        }
      })
      .addCase(ConsultTax.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.taxPix = null;
      })
      .addCase(ConsultTax.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.taxPix = payload;
          }
        }
      });
  },
});

export const { reset } = pixSlice.actions;
export default pixSlice.reducer;
