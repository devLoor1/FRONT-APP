import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetBankResponse } from '../models/user/bank.response';
import api from './api';
import { PutBankRequest } from '@/models/user/put.bank.request';

export const GetBank = createAsyncThunk('bank/getBank', async () => {
  const response = await api
    .get(`/member/bank`)
    .then((r): GetBankResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const ChangeBank = createAsyncThunk('bank/putBank', async (request: PutBankRequest) => {
  const response = await api
    .put(`/member/bank`, request)
    .then(() => true)
    .catch(error => {
      return error.response.data;
    });
  return response;
});
