import { createSlice } from '@reduxjs/toolkit';
import { AdvisorResponse } from '@/models-old/contact/advisor.response';
import { ListPendenciesResponse } from '@/models-old/contact/listPendencies.response';
import { GetAdvisor, GetPendencies, ResetChat } from '@/services-old/contact';

const initialState = {
  listPendencies: <ListPendenciesResponse | null>null,
  advisorInfos: <AdvisorResponse | null>null,
  rResetChat: <boolean | null>null,
  loadingPendencies: false,
  loading: false,
  requestError: <null | string>null,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetPendencies.pending, state => {
        state.loadingPendencies = true;
        state.requestError = null;
        state.listPendencies = null;
      })
      .addCase(GetPendencies.fulfilled, (state, { payload }) => {
        state.loadingPendencies = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.listPendencies = payload;
          }
        }
      })
      .addCase(GetAdvisor.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.advisorInfos = null;
      })
      .addCase(GetAdvisor.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.advisorInfos = payload;
          }
        }
      })
      .addCase(ResetChat.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.rResetChat = null;
      })
      .addCase(ResetChat.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.rResetChat = payload;
          }
        }
      });
  },
});

export const { reset } = contactSlice.actions;
export default contactSlice.reducer;
