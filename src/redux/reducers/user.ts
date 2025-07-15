import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ChangeUserDetails,
  ChangeUserPicture,
  GetHash,
  GetPaymentMethodAvailable,
  GetPixAvailable,
  GetStoreVersion,
  GetUserDetails,
  GetUserPicture,
  GetUserStatus,
  GetAddress,
} from '@/services/user';
import { PixAvailableResponse } from '@/models/payment/pixAvailable.response';
import { UserStatusResponse } from '@/models/user/userStatus.response';
import { GetHashResponse } from '@/models/user/getHash.response';
import { GetVersionResponse } from '@/models/user/getVersion.response';
import { UserDetailsResponse } from '@/models/user/userDetails';
import { PaymentMethodAvailableResponse } from '@/models/payment/paymentMethodAvailable.response';
import { UserPictureResponse } from '@/models/register/userPicture.response';
import { UserType } from '@/models-old/types/User';
import { CepResponse } from '@/models/register/cep.response';
import { AddressRequest } from '@/models/register/address.request';

const initialState = {
  user: <UserType | null>{ logged: false },
  loadingCustomer: false,
  pixStatus: <PixAvailableResponse | null>null,
  paymentMethodStatus: <PaymentMethodAvailableResponse | null>null,
  userStatus: <UserStatusResponse | null>null,
  userHash: <GetHashResponse | null>null,
  storeAppVersion: <GetVersionResponse | null>null,
  listUserDetail: <UserDetailsResponse | null>null,
  rChangeUserDetail: <boolean | null>null,
  loading: false,
  loadingPicture: false,
  pictureResponse: <boolean | null>null,
  userPicture: <UserPictureResponse | null>null,
  loadingUserStatus: false,
  requestError: <null | string>null,
  userStatusError: <null | string>null,
  requestCustomerError: <null | string>null,
  userAddress: <AddressRequest | null>null,
  requestCepError: <null | string>null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: () => initialState,
    resetChange: state => {
      state.rChangeUserDetail = null;
      state.listUserDetail = null;
      state.requestError = null;
    },
    resetPicture: state => {
      state.pictureResponse = null;
      state.loadingPicture = false;
      state.requestError = null;
    },
    setUser: (state, { payload }: PayloadAction<UserType | null>) => {
      state.user = payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(GetPixAvailable.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.pixStatus = null;
      })
      .addCase(GetPixAvailable.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.pixStatus = <PixAvailableResponse>payload;
          }
        }
      })
      .addCase(GetUserStatus.pending, state => {
        state.loadingUserStatus = true;
        state.userStatusError = null;
      })
      .addCase(GetUserStatus.fulfilled, (state, { payload }) => {
        state.loadingUserStatus = false;
        if (payload) {
          if (payload.message) {
            state.userStatusError = payload.message;
          } else {
            state.userStatus = payload;
          }
        }
      })
      .addCase(GetHash.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(GetHash.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.userHash = payload;
          }
        }
      })
      .addCase(GetStoreVersion.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(GetStoreVersion.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.storeAppVersion = payload;
          }
        }
      })
      .addCase(GetUserDetails.pending, state => {
        state.loading = true;
        state.listUserDetail = null;
      })
      .addCase(GetUserDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.listUserDetail = payload;
            state.userAddress = {
              city: payload.address?.city || '',
              complement: payload.address?.complement || '',
              neighborhood: payload.address?.neighborhood || '',
              postalCode: payload.address?.postalCode || '',
              state: payload.address?.state || '',
              street: payload.address?.street || '',
              streetNumber: payload.address?.streetNumber || ''
            }
          }
        }
      })
      .addCase(ChangeUserDetails.pending, state => {
        state.rChangeUserDetail = null;
      })
      .addCase(ChangeUserDetails.fulfilled, (state, { payload }) => {
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.rChangeUserDetail = payload;
          }
        }
      })
      .addCase(GetPaymentMethodAvailable.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.paymentMethodStatus = null;
      })
      .addCase(GetPaymentMethodAvailable.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.paymentMethodStatus = payload;
          }
        }
      })
      .addCase(ChangeUserPicture.pending, state => {
        state.loadingPicture = true;
        state.requestError = null;
        state.pictureResponse = null;
      })
      .addCase(ChangeUserPicture.fulfilled, (state, { payload }) => {
        state.loadingPicture = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.pictureResponse = payload;
          }
        }
      })
      .addCase(GetUserPicture.pending, state => {
        state.requestError = null;
        state.userPicture = null;
      })
      .addCase(GetUserPicture.fulfilled, (state, { payload }) => {
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.userPicture = payload;
          }
        }
      })
      .addCase(GetAddress.pending, state => {
        state.requestError = null;
        state.requestCepError = null
      })
      .addCase(GetAddress.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (!payload || payload.erro) {
          state.requestCepError = 'CEP não encontrado!';
        } else {
          state.requestCepError = null;
          const address = <CepResponse>payload
          state.userAddress = {
            city: address.localidade || '',
            neighborhood: address.bairro || '',
            postalCode: address.cep || '',
            state: address.uf || '',
            street: address.logradouro || '',
            streetNumber: '',
          };
        }
      })
  },
});

export const { reset, resetChange, resetPicture, setUser } = userSlice.actions;
export default userSlice.reducer;
