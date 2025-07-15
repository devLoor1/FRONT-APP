import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PixAvailableResponse } from "@/models/payment/pixAvailable.response";
import { UserStatusResponse } from "@/models/user/userStatus.response";
import { GetHashResponse } from "@/models/user/getHash.response";
import { GetVersionResponse } from "@/models/user/getVersion.response";
import { UserDetailsResponse } from "@/models/user/userDetails";
import { PaymentMethodAvailableResponse } from "@/models/payment/paymentMethodAvailable.response";
import { UserPictureResponse } from "@/models/register/userPicture.response";
import { UserType } from "@/models-old/types/User";
import { AddressRequest } from "@/models/register/address.request";

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
  },
});

export const { reset, resetChange, resetPicture, setUser } = userSlice.actions;
export default userSlice.reducer;
