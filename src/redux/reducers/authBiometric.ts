import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  requestError: <null | string>null,
  succesBiometry: <boolean | null>null,
};

const authBiometricSlice = createSlice({
  name: "authBiometric",
  initialState,
  reducers: {
    resetBiometric: () => initialState,
  },
});

export const { resetBiometric } = authBiometricSlice.actions;
export default authBiometricSlice.reducer;
