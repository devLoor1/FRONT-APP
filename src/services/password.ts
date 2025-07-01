import { createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';
import { PutPasswordRequest } from '@/models/user/put.password.request';

// eslint-disable-next-line import/prefer-default-export
export const PutPassword = createAsyncThunk(
  'user/putPassword',
  async (request: PutPasswordRequest) => {
    const response = await api
      .put(`/member/user/alter/password`, request)
      .then(() => true)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
