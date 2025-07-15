import { createSlice } from '@reduxjs/toolkit';
import { getTokenDocuments, sendDocuments, sendSignedResponse } from '@/services-old/caf';

const initialState = {
  loading: false,
  mobileToken: <string | null>null,
  personId: <string | null>null,
  cafStatus: <boolean | null>null,
  livenessComplete: <boolean | null>null,
  requestError: <null | string>null,
};

const cafSlice = createSlice({
  name: 'caf',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder

      .addCase(getTokenDocuments.pending, state => {
        // state.loading = true;
      })
      .addCase(getTokenDocuments.fulfilled, (state, { payload }) => {
        // state.loading = false;
        state.livenessComplete = false
        state.requestError = null;

        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.mobileToken = payload.token;
            state.personId = payload.document;
          }
        } else {
          state.requestError = "Erro interno. Entre em contato com o suporte.";
        }
      })

      //////////////////////// DOCUMENTO
      .addCase(sendDocuments.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(sendDocuments.fulfilled, (state, { payload }) => {
        state.loading = false;

        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.cafStatus = true;
          }
        } else {
          state.requestError = "Erro interno. Entre em contato com o suporte.";
        }
      })

      //////////////////////// LIVENESS
      .addCase(sendSignedResponse.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(sendSignedResponse.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.livenessComplete = true
          }
        } else {
          state.requestError = "Erro interno. Entre em contato com o suporte.";
        }
      })

  },
});

export const { reset } = cafSlice.actions;
export default cafSlice.reducer;
