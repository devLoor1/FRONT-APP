import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { validateBiometricRequest as BaseRequest } from '@/models-old/auth/validateBiometric.request';

type RequestWithToken = BaseRequest & { deviceToken: string };

export const ValidateBiometric = createAsyncThunk('auth/validateBiometric', async (request: RequestWithToken) => {
  const { deviceToken, ...payload } = request;
  const response = await api
    .post(`/authorize/auth/validate`, payload, {
      headers: {
        'X-Device-Token': deviceToken,
      },
    })
    .then(() => true)
    .catch(error => {
      return error.response.data;
    });
    return response;
  }
);