import * as SecureStore from 'expo-secure-store';

const SecureStorage = {
  SetLoginBiometry({ checked }: { checked: boolean }) {
    SecureStore.setItemAsync('WiseInvestorSecure_loginBiometry', checked.toString());
  },

  GetLoginBiometry(): Promise<string | null> {
    return SecureStore.getItemAsync('WiseInvestorSecure_loginBiometry');
  },

  SetInvestBiometry({ checked }: { checked: boolean }) {
    SecureStore.setItemAsync('WiseInvestorSecure_investBiometry', checked.toString());
  },

  GetInvestBiometry(): Promise<string | null> {
    return SecureStore.getItemAsync('WiseInvestorSecure_investBiometry');
  },
};

export default SecureStorage;
