import * as SecureStore from 'expo-secure-store';

const CommonStorage = {
  SetDeppLinkId(id: string) {
    SecureStore.setItemAsync('WiseInvestorDeppLink_id', id);
  },

  GetDeppLinkId(): Promise<string | null> {
    return SecureStore.getItemAsync('WiseInvestorDeppLink_id');
  },

  SetHideOnboarding(hide: boolean): void {
    SecureStore.setItemAsync('WealthInvestorHide_onboarding', hide.toString());
  },

  GetHideOnboarding(): Promise<string | null> {
    return SecureStore.getItemAsync('WealthInvestorHide_onboarding');
  },
};

export default CommonStorage;
