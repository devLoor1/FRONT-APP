import { createAsyncThunk } from '@reduxjs/toolkit';
import { ExcerptRequest } from '@/models/excerpt/excerpt.request';
import { ExcerptResponse } from '@/models/excerpt/excerpt.response';
import api from './api';

// eslint-disable-next-line import/prefer-default-export
export const GetExcerpt = createAsyncThunk(
  'excerpt/list',
  async ({ params }: ExcerptRequest, { rejectWithValue }) => {
    const response = await api
      .get(`/investment/invest/transactions?${params}`, {})
      .then((r): ExcerptResponse => r.data)
      .catch(error => {
        return rejectWithValue(error.response.data);
      });
    return response;
  }
);

// Endpoint de enviar email ta sendo desenvolvido:
export const PostExcerpstEmail = createAsyncThunk(
  'excerpt/post',
  async (params: { month: string; year: string }) => {
    const response = await api
      .post('/investment/invest/send-email', { data: params })
      .then((r): any => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
