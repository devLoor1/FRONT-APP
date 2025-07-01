import { createSlice } from '@reduxjs/toolkit';
import { GetAvaliationStatus } from '@/services/avaliation';

const initialState = {
  allowed: <boolean | null>null,
  loading: false,
  requestError: <null | string>null,
};

const AvaliationSlice = createSlice({
  name: 'avaliation',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetAvaliationStatus.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.allowed = null;
      })
      .addCase(GetAvaliationStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {

          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.allowed = payload.allowed;
          }
        }
      });
  },
});

export const { reset } = AvaliationSlice.actions;
export default AvaliationSlice.reducer;
