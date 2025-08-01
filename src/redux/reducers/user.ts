import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { PixAvailableResponse } from "@/models/payment/pixAvailable.response";
import { UserStatusResponse } from "@/models/user/userStatus.response";
import { GetHashResponse } from "@/models/user/getHash.response";
import { GetVersionResponse } from "@/models/user/getVersion.response";
import { UserDetailsResponse } from "@/models/user/userDetails";
import { PaymentMethodAvailableResponse } from "@/models/payment/paymentMethodAvailable.response";
import { UserPictureResponse } from "@/models/register/userPicture.response";
import { UserType } from "@/models-old/types/User";
import { AddressRequest } from "@/models/register/address.request";
import { Me } from "@/models/user/me.response";
import { PersonalInformationResponse } from "@/models/user";
import { getMe, getPersonalInformation } from "@/services/user";

// Thunks para buscar dados do usuário
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      console.log("fetchUserData thunk - Iniciando busca de dados do usuário");
      const userData = await getMe();
      console.log("fetchUserData thunk - Dados obtidos com sucesso:", userData);
      return userData;
    } catch (error: any) {
      console.log("fetchUserData thunk - Erro ao buscar dados:", error);
      return rejectWithValue(error.response?.data?.message || "Erro ao buscar dados do usuário");
    }
  }
);

export const fetchPersonalInformation = createAsyncThunk(
  "user/fetchPersonalInformation",
  async (_, { rejectWithValue }) => {
    try {
      const personalInfo = await getPersonalInformation();
      return personalInfo;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Erro ao buscar dados pessoais");
    }
  }
);

const initialState = {
  // Dados básicos do usuário logado
  user: <UserType | null>null,
  
  // Dados completos do usuário (getMe)
  userData: <Me | null>null,
  
  // Dados pessoais do usuário
  personalInformation: <PersonalInformationResponse | null>null,
  
  // Estados de loading
  loadingUserData: false,
  loadingPersonalInfo: false,
  loadingCustomer: false,
  loadingPicture: false,
  loadingUserStatus: false,
  
  // Outros dados
  pixStatus: <PixAvailableResponse | null>null,
  paymentMethodStatus: <PaymentMethodAvailableResponse | null>null,
  // userStatus: <UserStatusResponse | null>null,
  userHash: <GetHashResponse | null>null,
  storeAppVersion: <GetVersionResponse | null>null,
  listUserDetail: <UserDetailsResponse | null>null,
  rChangeUserDetail: <boolean | null>null,
  pictureResponse: <boolean | null>null,
  userPicture: <UserPictureResponse | null>null,
  
  // Estados de erro
  requestError: <null | string>null,
  userStatusError: <null | string>null,
  requestCustomerError: <null | string>null,
  userAddress: <AddressRequest | null>null,
  requestCepError: <null | string>null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: () => initialState,
    resetChange: (state) => {
      state.rChangeUserDetail = null;
      state.listUserDetail = null;
      state.requestError = null;
    },
    resetPicture: (state) => {
      state.pictureResponse = null;
      state.loadingPicture = false;
      state.requestError = null;
    },
    setUser: (state, { payload }: PayloadAction<UserType | null>) => {
      state.user = payload;
    },
    // Novos reducers para dados do usuário
    setUserData: (state, { payload }: PayloadAction<Me | null>) => {
      state.userData = payload;
    },
    setPersonalInformation: (state, { payload }: PayloadAction<PersonalInformationResponse | null>) => {
      state.personalInformation = payload;
    },
    setLoadingUserData: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingUserData = payload;
    },
    setLoadingPersonalInfo: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingPersonalInfo = payload;
    },
  },
  extraReducers: (builder) => {
    // fetchUserData
    builder
      .addCase(fetchUserData.pending, (state) => {
        console.log("fetchUserData.pending - Iniciando busca de dados do usuário");
        state.loadingUserData = true;
        state.requestError = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        console.log("fetchUserData.fulfilled - Dados do usuário carregados:", action.payload);
        state.loadingUserData = false;
        state.userData = action.payload;
        // Marcar usuário como logado quando os dados são carregados com sucesso
        state.user = {
          logged: true,
          name: action.payload.full_name,
          email: action.payload.email,
          cellphone: action.payload.phone,
          balance: null,
          balanceBonus: 0,
          balanceTot: 0,
        };
        console.log("Estado do usuário atualizado:", {
          logged: state.user?.logged,
          name: state.user?.name,
          email: state.user?.email
        });
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        console.log("fetchUserData.rejected - Erro ao carregar dados do usuário:", action.payload);
        state.loadingUserData = false;
        state.requestError = action.payload as string;
      });
    
    // fetchPersonalInformation
    builder
      .addCase(fetchPersonalInformation.pending, (state) => {
        state.loadingPersonalInfo = true;
        state.requestError = null;
      })
      .addCase(fetchPersonalInformation.fulfilled, (state, action) => {
        state.loadingPersonalInfo = false;
        state.personalInformation = action.payload;
      })
      .addCase(fetchPersonalInformation.rejected, (state, action) => {
        state.loadingPersonalInfo = false;
        state.requestError = action.payload as string;
      });
  },
});

export const { 
  reset, 
  resetChange, 
  resetPicture, 
  setUser,
  setUserData,
  setPersonalInformation,
  setLoadingUserData,
  setLoadingPersonalInfo,
} = userSlice.actions;
export default userSlice.reducer;
