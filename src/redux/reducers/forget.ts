import { createSlice } from '@reduxjs/toolkit';
import { SendNewPassword } from '@/services/forget';

const initialState = {
  responseNewPassword: <boolean | null>null,
  loading: false,
  requestError: null,
};

const forgetSlice = createSlice({
  name: 'forget',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(SendNewPassword.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.responseNewPassword = null;
      })
      .addCase(SendNewPassword.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.responseNewPassword = payload;
          }
        }
      });
  },
});

export const { reset } = forgetSlice.actions;
export default forgetSlice.reducer;
