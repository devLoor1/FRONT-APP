import * as SecureStore from "expo-secure-store";

const isWeb = typeof window !== "undefined" && !globalThis.nativeModules;

const SecureStorage = {
  async SetLoginBiometry({ checked }: { checked: boolean }) {
    try {
      if (isWeb) {
        localStorage.setItem(
          "LoorInvestorSecure_loginBiometry",
          checked.toString()
        );
      } else {
        SecureStore.setItemAsync(
          "LoorInvestorSecure_loginBiometry",
          checked.toString()
        );
      }
    } catch (e) {
      console.warn("Failed to set login biometry:", e);
    }
  },

  async GetLoginBiometry(): Promise<string | null> {
    try {
      if (isWeb) {
        return localStorage.getItem("LoorInvestorSecure_loginBiometry");
      } else {
        return await SecureStore.getItemAsync("LoorInvestorSecure_loginBiometry");
      }
    } catch (e) {
      console.warn("Failed to get login biometry:", e);
      return null;
    }
  },

  async SetInvestBiometry({ checked }: { checked: boolean }) {
    try {
      if (isWeb) {
        localStorage.setItem(
          "LoorInvestorSecure_investBiometry",
          checked.toString()
        );
      } else {
        SecureStore.setItemAsync(
          "LoorInvestorSecure_investBiometry",
          checked.toString()
        );
      }
    } catch (e) {
      console.warn("Failed to set invest biometry:", e);
    }
  },

  async GetInvestBiometry(): Promise<string | null> {
    try {
      if (isWeb) {
        return localStorage.getItem("LoorInvestorSecure_investBiometry");
      } else {
        return await SecureStore.getItemAsync("LoorInvestorSecure_investBiometry");
      }
    } catch (e) {
      console.warn("Failed to get invest biometry:", e);
      return null;
    }
  },
};

export default SecureStorage;
