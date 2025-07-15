export type AuthResponse = {
  // accessToken: string;
  // expireAccessToken?: string;
  // updateToken?: string;
  // expireUpdateToken?: string;
  // cryptoDeviceToken?: string;
  // expire?: string;

  message: string;
  data: {
    personal_information_filled: string;
    token: string;
  };
};
