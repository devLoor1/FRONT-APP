export type AuthResponse = {
  message: string;
  data: {
    personal_information_filled?: boolean | number | string;
    token: string;
  };
};
