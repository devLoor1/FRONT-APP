import { createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';
import { AvaliationRequest } from '@/models/avaliation/avaliation.request';

export const PostAvaliation = createAsyncThunk('invest/avaliation', async (request: AvaliationRequest) => {
  const response = await api
    .post(`/investment/feedback`, request)
    .then((r): any => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const GetAvaliationStatus = createAsyncThunk('investment/feedback/status', async () => {
  const response = await api
    .get(`/investment/feedback/status`)
    .then((r): boolean => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});
