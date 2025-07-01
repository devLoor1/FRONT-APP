import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStorage from '@/storages/auth-storage';
import SecureStorage from '@/storages/secure-storage';
import refreshToken from '../refreshToken';
import { biometricsAuth, hasAuth } from './biometry';
import api from '@/services/api';

async function DoBiometryValidation(): Promise<boolean | string> {
  const privateToken = await AuthStorage.GetPrivateToken();
  const loginBiometry = await SecureStorage.GetLoginBiometry();
  const auth = await hasAuth();

  let getAuth: boolean | string = false;

  if (!auth || loginBiometry !== 'true') {
    if (privateToken) {
      AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove);
    }
    return getAuth;
  }

  const updateToken = await AuthStorage.GetRefreshToken();
  const getExpire = await AuthStorage.GetExpireRefreshToken();

  if (!privateToken || !updateToken || !getExpire) {
    return getAuth;
  }

  const today = new Date();

  if (today >= new Date(getExpire)) {
    AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove);

    getAuth = 'Token expirado!';
    return getAuth;
  }

  let refresh;
  try {
    refresh = await refreshToken();
  } catch (error) {
    getAuth = 'Erro ao realizar refresh token!';
    AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove);
  }
  if (refresh && refresh.accessToken) {
    const authBiometric = await biometricsAuth();
    if (authBiometric) {
      if (authBiometric.success) {
        if (authBiometric.success === true) {
          api.defaults.headers.Authorization = `Bearer ${privateToken}`;
          getAuth = true;
        }
      } else if (authBiometric.error === 'user_cancel') {
        getAuth = 'Biometria cancelada!';
        AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove);
      }
    }
  }

  return getAuth;
}

export default DoBiometryValidation;
