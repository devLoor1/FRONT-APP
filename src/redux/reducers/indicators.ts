import { createSlice } from '@reduxjs/toolkit';
import { GetGeneralIndicators, GetIndividualIndicators } from '@/services/indicators';
import { GeneralIndicatorsResponse } from '@/models/indicators/generalIndicators.response';
import { IndividualIndicatorsResponse } from '@/models/indicators/individualIndicators.response';

const initialState = {
  generalIndicators: <GeneralIndicatorsResponse | null>null,
  individualIndicators: <IndividualIndicatorsResponse | null>null,
  loading: false,
  loadingIndividual: false,
  requestError: <null | string>null,
};

const indicatorsSlice = createSlice({
  name: 'indicators',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetGeneralIndicators.pending, state => {
        state.loading = true;
        state.generalIndicators = null;
      })
      .addCase(GetGeneralIndicators.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.generalIndicators = <GeneralIndicatorsResponse>payload;
          }
        }
      })
      .addCase(GetIndividualIndicators.pending, state => {
        state.loadingIndividual = true;
        state.individualIndicators = null;
      })
      .addCase(GetIndividualIndicators.fulfilled, (state, { payload }) => {
        state.loadingIndividual = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.individualIndicators = <IndividualIndicatorsResponse>payload;
          }
        }
      });
  },
});

export const { reset } = indicatorsSlice.actions;
export default indicatorsSlice.reducer;
