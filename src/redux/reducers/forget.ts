import { createSlice } from "@reduxjs/toolkit";
import { SendNewPassword } from "@/services-old/forget";

const initialState = {
  responseNewPassword: <boolean | null>null,
  loading: false,
  requestError: null,
};

const forgetSlice = createSlice({
  name: "forget",
  initialState,
  reducers: {
    reset: () => initialState,
  },
});

export const { reset } = forgetSlice.actions;
export default forgetSlice.reducer;
