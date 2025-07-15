import { createSlice } from '@reduxjs/toolkit';
import { ConfirmAnticipate, GetList, Simulate } from '@/services-old/anticipate';
import { ListResponse } from '@/models-old/anticipate/list.response';
import { SimulateResponse } from '@/models-old/anticipate/simulate.response';
import { ConfirmResponse } from '@/models-old/anticipate/confirm.response';

const initialState = {
  anticipateList: <ListResponse | null>null,
  simulateValues: <SimulateResponse | null>null,
  valuesToConfirm: <ConfirmResponse | null>null,
  loading: false,
  loadingSimulate: false,
  requestError: <null | string>null,
  moreInvestiments: <boolean>true,
};

const anticipateSlice = createSlice({
  name: 'anticipate',
  initialState,
  reducers: {
    reset: state => {
      state.anticipateList = <ListResponse | null>null;
      state.simulateValues = <SimulateResponse | null>null;
      state.loading = false;
      state.loadingSimulate = false;
      state.requestError = <null | string>null;
      state.moreInvestiments = <boolean>true;
    },
    resetConfirmValues: state => {
      state.valuesToConfirm = <ConfirmResponse | null>null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(GetList.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.anticipateList = null;
      })
      .addCase(GetList.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else if (payload.length === 0) {
            state.moreInvestiments = false;
          } else {
            state.anticipateList = payload;
          }
        }
      })
      .addCase(Simulate.pending, state => {
        state.loadingSimulate = true;
        state.requestError = null;
        state.simulateValues = null;
      })
      .addCase(Simulate.fulfilled, (state, { payload }) => {
        state.loadingSimulate = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.simulateValues = payload;
          }
        }
      })
      .addCase(ConfirmAnticipate.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.valuesToConfirm = null;
      })
      .addCase(ConfirmAnticipate.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.urlAssinatura) {
            state.valuesToConfirm = payload;
          } else {
            state.requestError = payload.message;
          }
        }
      });
  },
});

export const { reset, resetConfirmValues } = anticipateSlice.actions;
export default anticipateSlice.reducer;
