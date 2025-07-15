import { createSlice } from '@reduxjs/toolkit';
import { GetPublicOpportunities } from '../../services-old/onboarding';
import { ListPublicOpportunitiesResponse } from '@/models/opportunities/publicOpportunities';

const initialState = {
  listOpportunites: <ListPublicOpportunitiesResponse | null>null,
  loading: false,
  requestError: <null | string>null,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetPublicOpportunities.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.listOpportunites = null;
      })
      .addCase(GetPublicOpportunities.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.listOpportunites = payload;
          }
        }
      });
  },
});

export const { reset } = onboardingSlice.actions;
export default onboardingSlice.reducer;
