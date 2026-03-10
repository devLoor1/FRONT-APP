import * as SecureStore from 'expo-secure-store';

const isWeb = typeof window !== "undefined" && !globalThis.nativeModules;

const CommonStorage = {
  async SetDeppLinkId(id: string) {
    try {
      if (isWeb) {
        localStorage.setItem('WiseInvestorDeppLink_id', id);
      } else {
        SecureStore.setItemAsync('WiseInvestorDeppLink_id', id);
      }
    } catch (e) {
      console.warn("Failed to set DeppLink id:", e);
    }
  },

  async GetDeppLinkId(): Promise<string | null> {
    try {
      if (isWeb) {
        return localStorage.getItem('WiseInvestorDeppLink_id');
      } else {
        return await SecureStore.getItemAsync('WiseInvestorDeppLink_id');
      }
    } catch (e) {
      console.warn("Failed to get DeppLink id:", e);
      return null;
    }
  },

  async SetHideOnboarding(hide: boolean): Promise<void> {
    try {
      if (isWeb) {
        localStorage.setItem('WealthInvestorHide_onboarding', hide.toString());
      } else {
        SecureStore.setItemAsync('WealthInvestorHide_onboarding', hide.toString());
      }
    } catch (e) {
      console.warn("Failed to set hide onboarding:", e);
    }
  },

  async GetHideOnboarding(): Promise<string | null> {
    try {
      if (isWeb) {
        return localStorage.getItem('WealthInvestorHide_onboarding');
      } else {
        return await SecureStore.getItemAsync('WealthInvestorHide_onboarding');
      }
    } catch (e) {
      console.warn("Failed to get hide onboarding:", e);
      return null;
    }
  },
};

export default CommonStorage;
