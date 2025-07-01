import { createSlice } from '@reduxjs/toolkit';
import { OpportunitiesResponse } from '@/models/opportunities/opportunities.response';
import { GetCode, GetOpportunities, SendCode } from '@/services/opportunities';

const initialState = {
  listOpportunities: <OpportunitiesResponse | null>null,
  succesGetCode: <boolean | null>null,
  returnSendCode: <boolean | null>null,
  loading: false,
  loadingList: <boolean>false,
  requestError: <null | string>null,
  moreOpportunities: <boolean>true,
  publicMoreOpportunities: <boolean>true,
};

const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    reset: () => initialState,
    resetCode: state => {
      state.succesGetCode = null;
    },
    resetInvest: state => {
      state.succesGetCode = null;
      state.returnSendCode = null;
      state.requestError = null;
    },
    resetListOpportunities: state => {
      state.listOpportunities = <OpportunitiesResponse | null>null;
      state.loadingList = false;
      state.requestError = <null | string>null;
      state.moreOpportunities = <boolean>true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(GetOpportunities.pending, state => {
        state.loadingList = true;
        state.requestError = null;
        state.listOpportunities = null;
      })
      .addCase(GetOpportunities.fulfilled, (state, { payload }) => {
        state.loadingList = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else if (payload.length === 0) {
            state.moreOpportunities = false;
          } else {
            state.listOpportunities = <OpportunitiesResponse>payload;
          }
        }
      })
      .addCase(GetCode.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.succesGetCode = null;
      })
      .addCase(GetCode.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.succesGetCode = payload;
          }
        }
      })
      .addCase(SendCode.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.returnSendCode = null;
      })
      .addCase(SendCode.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.returnSendCode = payload;
          }
        }
      });
  },
});

export const { reset, resetCode, resetInvest, resetListOpportunities } = opportunitiesSlice.actions;
export default opportunitiesSlice.reducer;
