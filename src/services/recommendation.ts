import { createAsyncThunk } from '@reduxjs/toolkit';
import { CodeResponse } from '@/models/recommendation/code.response';
import api from './api';

// eslint-disable-next-line import/prefer-default-export
export const GetCodeRecommendation = createAsyncThunk('recommendation/getCode', async () => {
  const response = await api
    .get(`/investment/invest/campaign/recommendation`)
    .then((r): CodeResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});
