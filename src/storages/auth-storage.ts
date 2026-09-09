import * as SecureStore from 'expo-secure-store';

const PRIVATE_TOKEN_KEY = '@WiseInvestor:private_token';

const AuthStorage = {
  // async SetPublicToken(token: string) {
  //   AsyncStorage.setItem('@WiseInvestor:public_token', token);
  // },

  // GetPublicToken(): Promise<string | null> {
  //   return AsyncStorage.getItem('@WiseInvestor:public_token');
  // },

  async SetPrivateToken(token: string) {
    await SecureStore.setItemAsync(PRIVATE_TOKEN_KEY, token);
  },

  GetPrivateToken() {
    return SecureStore.getItemAsync(PRIVATE_TOKEN_KEY);
  },

  ClearPrivateToken() {
    return SecureStore.deleteItemAsync(PRIVATE_TOKEN_KEY);
  },

  // async SetExpire(val: string) {
  //   AsyncStorage.setItem('@WiseInvestor:expire', val);
  // },

  // GetExpire() {
  //   return AsyncStorage.getItem('@WiseInvestor:expire');
  // },

  // async SetRefreshToken(token: string) {
  //   AsyncStorage.setItem('@WiseInvestor:refreshToken', token);
  // },

  // GetRefreshToken(): Promise<string | null> {
  //   return AsyncStorage.getItem('@WiseInvestor:refreshToken');
  // },

  // async SetExpireRefreshToken(val: string) {
  //   AsyncStorage.setItem('@WiseInvestor:expireRefreshToken', val);
  // },

  // GetExpireRefreshToken() {
  //   return AsyncStorage.getItem('@WiseInvestor:expireRefreshToken');
  // },
};

export default AuthStorage;
