import { createSlice } from '@reduxjs/toolkit';
import { ValidateBiometric } from '@/services-old/authBiometric';

const initialState = {
  loading: false,
  requestError: <null | string>null,
  succesBiometry: <boolean | null>null,
};

const authBiometricSlice = createSlice({
  name: 'authBiometric',
  initialState,
  reducers: {
    resetBiometric: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(ValidateBiometric.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.succesBiometry = null;
      })
      .addCase(ValidateBiometric.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.succesBiometry = payload;
          }
        }
      });
  },
});

export const { resetBiometric } = authBiometricSlice.actions;
export default authBiometricSlice.reducer;
