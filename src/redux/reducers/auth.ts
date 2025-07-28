import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getMe } from '@/services/user';
import { Me } from '@/models/user/me.response';

interface AuthState {
  // Estado de autenticação
  isAuthenticated: boolean;
  token: string | null;
  personalInformationFilled: boolean;
  
  // Dados do usuário
  user: Me | null;
  
  // Estados de loading
  loading: boolean;
  loadingUser: boolean;
  
  // Estados de erro
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  personalInformationFilled: false,
  user: null,
  loading: false,
  loadingUser: false,
  error: null,
};

// Thunk para buscar dados do usuário
export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await getMe();
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar dados do usuário');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData: (state, action: PayloadAction<any>) => {
      const { token, personal_information_filled } = action.payload.data;
      state.token = token;
      state.personalInformationFilled = personal_information_filled === 1;
      state.isAuthenticated = true;
      state.error = null;
    },
    setUserData: (state, action: PayloadAction<Me>) => {
      state.user = action.payload;
      state.loadingUser = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoadingUser: (state, action: PayloadAction<boolean>) => {
      state.loadingUser = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.personalInformationFilled = false;
      state.user = null;
      state.loading = false;
      state.loadingUser = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loadingUser = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loadingUser = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loadingUser = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setLoginData, 
  setUserData, 
  setLoading, 
  setLoadingUser, 
  setError, 
  logout 
} = authSlice.actions;

export default authSlice.reducer;
