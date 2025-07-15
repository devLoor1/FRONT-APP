import { createSlice } from '@reduxjs/toolkit';
import { RequirementsToRemoveResponse } from '@/models-old/removeAccount/requirementsToRemove.response';
import { GetRequirementsToRemove } from '@/services-old/removeAccount';

const initialState = {
  rListRequirements: <RequirementsToRemoveResponse | null>null,
  loading: false,
  requestError: <null | string>null,
};

const removeAccountSlice = createSlice({
  name: 'removeAccount',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetRequirementsToRemove.pending, state => {
        state.loading = true;
      })
      .addCase(GetRequirementsToRemove.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.rListRequirements = payload;
          }
        }
      });
  },
});

export const { reset } = removeAccountSlice.actions;
export default removeAccountSlice.reducer;
