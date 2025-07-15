import { createSlice } from '@reduxjs/toolkit';
import { PutPassword } from '@/services-old/password';

const initialState = {
  changePassword: <boolean | null>null,
  loading: false,
  requestError: <null | string>null,
};

const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(PutPassword.pending, state => {
        state.requestError = null;
        state.loading = true;
        state.changePassword = null;
      })
      .addCase(PutPassword.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.changePassword = payload;
          }
        }
      });
  },
});

export const { reset } = passwordSlice.actions;
export default passwordSlice.reducer;
