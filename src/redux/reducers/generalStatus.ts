import { createSlice } from '@reduxjs/toolkit';
import {
  GetAnticipateStatus,
  GetPersonalDataStatus,
  GetReportStatus,
} from '@/services-old/generalStatus';
import { StatusResponse } from '@/models-old/idWall/status.response';
import { AvailableResponse } from '@/models-old/anticipate/available.response';
import { PersonalDataStatusResponse } from '@/models/register/personalDataStatus.response';

const initialState = {
  docsStatus: <StatusResponse | null>null,
  anticipateStatus: <AvailableResponse | null>null,
  personalDataStatus: <PersonalDataStatusResponse | null>null,
  loading: false,
  requestError: <null | string>null,
};

const generalStatusSlice = createSlice({
  name: 'generalStatus',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(GetAnticipateStatus.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.anticipateStatus = null;
      })
      .addCase(GetAnticipateStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.anticipateStatus = payload;
          }
        }
      })
      .addCase(GetReportStatus.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.docsStatus = null;
      })
      .addCase(GetReportStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.docsStatus = payload;
          }
        }
      })
      .addCase(GetPersonalDataStatus.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.personalDataStatus = null;
      })
      .addCase(GetPersonalDataStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.personalDataStatus = payload;
          }
        }
      });
  },
});

export default generalStatusSlice.reducer;
