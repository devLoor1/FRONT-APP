import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthStorage = {
  // async SetPublicToken(token: string) {
  //   AsyncStorage.setItem('@WiseInvestor:public_token', token);
  // },

  // GetPublicToken(): Promise<string | null> {
  //   return AsyncStorage.getItem('@WiseInvestor:public_token');
  // },

  async SetPrivateToken(token: string) {
    AsyncStorage.setItem('@WiseInvestor:private_token', token);
  },

  GetPrivateToken() {
    return AsyncStorage.getItem('@WiseInvestor:private_token');
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
