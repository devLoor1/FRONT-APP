import Constants from 'expo-constants';
import axios from 'axios';
import AuthStorage from '@/storages/auth-storage';
import deviceData from '../deviceData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { RootStateOrAny } from 'react-redux';
import eventEmitter from '@/helpers/eventEmitter';

let store: RootStateOrAny;

export const injectStore = (_store: RootStateOrAny) => {
  store = _store;
};

export const apiRefresh = axios.create({
  baseURL: Constants?.expoConfig?.extra?.env?.baseUrl || 'https://sua-url-padrao.com',
  headers: {
    'device-info': deviceData,
    Authorization: Constants?.expoConfig?.extra?.env?.basicAuth || '',
  },
});

async function refreshToken(failedRequest?: any) {
  try {
    const getUpdateToken = AuthStorage.GetRefreshToken();
    const getAccessToken = AuthStorage.GetPrivateToken();

    const rs = await apiRefresh.post('/authorize/auth/v3/refresh', {
      updateToken: await getUpdateToken,
      accessToken: await getAccessToken,
    });

    const { updateToken, expireAccessToken, expireUpdateToken, accessToken } = rs.data;
    await Promise.all([
      AuthStorage.SetPrivateToken(accessToken),
      AuthStorage.SetExpire(expireAccessToken),
      AuthStorage.SetRefreshToken(updateToken),
      AuthStorage.SetExpireRefreshToken(expireUpdateToken),
    ]);

    if (failedRequest) {
      failedRequest.response.config.headers['Authorization'] = 'Bearer ' + accessToken;
    }

    return rs.data;
  } catch (error: any) {
    if (error?.response?.status === 400) {
      eventEmitter.emit('showSnack', {
        type: 'information',
        message: 'Sessão expirada. Faça login novamente.',
      });
    
      store.dispatch({ type: 'LOGOUT' });
    
      await AsyncStorage.clear();
    
      if (Platform.OS !== 'ios') {
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
      }
    
      await Promise.all([
        AuthStorage.SetPrivateToken(''),
        AuthStorage.SetPublicToken(''),
        AuthStorage.SetRefreshToken(''),
        AuthStorage.SetExpire(''),
        AuthStorage.SetExpireRefreshToken(''),
      ]);
    }

    throw error;
  }
}

export default refreshToken;
