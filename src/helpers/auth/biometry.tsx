import {
  hasHardwareAsync,
  isEnrolledAsync,
  authenticateAsync,
  LocalAuthenticationResult,
} from 'expo-local-authentication';
import SecureStorage from '@/storages/secure-storage';

export async function hasAuth() {
  const compatible = await hasHardwareAsync();
  const enrolled = await isEnrolledAsync();

  if (!compatible || !enrolled) {
    await SecureStorage.SetLoginBiometry({ checked: false });
    await SecureStorage.SetInvestBiometry({ checked: false });
    return false;
  }

  return true;
}

export const biometricsAuth = async () => {
  const result: LocalAuthenticationResult = await authenticateAsync();
  return result;
};
