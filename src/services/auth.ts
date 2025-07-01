import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthRequest } from '@/models/auth/auth.request';
import { AuthResponse } from '@/models/auth/auth.response';
import api from './api';
import { NewcellRequest } from '@/models/auth/newphone.request';
import apiPublic from './apiPublic';
import Debug from '@/helpers/debug';
import LogRocketHelper from '@/helpers/logRocket';
import { handleAnalyticsUserProfile } from '@/helpers/analytics';

export const Login = createAsyncThunk('auth/login', async (request: AuthRequest) => {
  Debug.SetUser({ email: request.identifier });
  LogRocketHelper.SetUser({ email: request.identifier });
  const response = await apiPublic
    .post('/authorize/auth/v3/login', request)
    .then((r): AuthResponse => {
      const { accessToken } = r.data;
      api.defaults.headers.Authorization = `Bearer ${accessToken}`;

      handleAnalyticsUserProfile('sigIn', { Identity: r.data.hash })
      return r.data;
    })
    .catch(error => {
      Debug.Capture(error);
      return error.response.data;
    });
  return response;
});

export const GetNewDeviceCode = createAsyncThunk(
  'auth/getNewDeviceCode',
  async (request: NewcellRequest) => {
    const response = await api
      .post(`/mfa/identifier/change/device`, request)
      .then(() => true)
      .catch(error => {
        return error.response.data;
      });

    return response;
  }
);

export const PostNewDeviceCode = createAsyncThunk(
  'auth/postNewDeviceCode',
  async ({ request, code }: any) => {
    const response = await api
      .patch(`/mfa/identifier/v2/change/device/${code}`, request)
      .then((r): AuthResponse => {
        const { accessToken } = r.data;
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        return r.data;
      })
      .catch(error => {
        return error.response.data;
      });

    return response;
  }
);
