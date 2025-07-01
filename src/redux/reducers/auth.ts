import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  loginData: any | null;
  loading: boolean;
  requestError: string | null;
  succesGetCode: boolean;
  loginError: string | null;
}

const initialState: AuthState = {
  loginData: null,
  loading: false,
  requestError: null,
  succesGetCode: false,
  loginError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData: (state, action: PayloadAction<any>) => {
      state.loginData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setRequestError: (state, action: PayloadAction<string | null>) => {
      state.requestError = action.payload;
    },
    setSuccesGetCode: (state, action: PayloadAction<boolean>) => {
      state.succesGetCode = action.payload;
    },
    setLoginError: (state, action: PayloadAction<string | null>) => {
      state.loginError = action.payload;
    },
    reset: (state) => {
      state.loginData = null;
      state.loading = false;
      state.requestError = null;
      state.succesGetCode = false;
      state.loginError = null;
    },
  },
});

export const { setLoginData, setLoading, setRequestError, setSuccesGetCode, setLoginError, reset } = authSlice.actions;
export default authSlice.reducer;
