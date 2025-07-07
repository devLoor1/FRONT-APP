import * as SecureStore from "expo-secure-store";

const SecureStorage = {
  SetLoginBiometry({ checked }: { checked: boolean }) {
    SecureStore.setItemAsync(
      "LoorInvestorSecure_loginBiometry",
      checked.toString()
    );
  },

  GetLoginBiometry(): Promise<string | null> {
    return SecureStore.getItemAsync("LoorInvestorSecure_loginBiometry");
  },

  SetInvestBiometry({ checked }: { checked: boolean }) {
    SecureStore.setItemAsync(
      "LoorInvestorSecure_investBiometry",
      checked.toString()
    );
  },

  GetInvestBiometry(): Promise<string | null> {
    return SecureStore.getItemAsync("LoorInvestorSecure_investBiometry");
  },
};

export default SecureStorage;
