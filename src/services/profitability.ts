import { createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';

export const getProfitability = createAsyncThunk('result/getProfitability', async () => {
  const response = await api
    .get(`investment/calc/table/interest`)
    .then((r): any => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
