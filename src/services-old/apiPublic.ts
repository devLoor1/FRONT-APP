import axios from 'axios';
import Constants from 'expo-constants';
import deviceData from '@/helpers/deviceData';
import * as Updates from 'expo-updates';
import Debug from '@/helpers/debug';

const apiPublic = axios.create({
  baseURL: Constants?.expoConfig?.extra?.env?.baseUrl || 'https://sua-url-padrao.com',
  headers: {
    'device-info': deviceData,
    'app-version': [
      Updates.channel,
      Constants.expoConfig?.extra?.env?.env,
      Constants.expoConfig?.extra?.version,
    ].join(' - '),
    'Content-Type': 'application/json',
    Authorization: Constants?.expoConfig?.extra?.env?.basicAuth || '',
  },
});

apiPublic.interceptors.response.use(
  config => {
    return config;
  },
  error => {
    Debug.Capture(error);
    return Promise.reject(error);
  }
);

export default apiPublic;
