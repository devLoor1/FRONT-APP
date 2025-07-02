import api from '../api';
import Debug from '@/helpers/debug';
import { createAsyncThunk } from '@reduxjs/toolkit';
import LogRocketHelper from '@/helpers/logRocket';
import { RegisterRequest } from '@/models/new/auth/register.request';

export const PostRegister = createAsyncThunk('PostRegister', async (request: RegisterRequest) => {
  let body = { ...request };

  if (request.full_name && request.email) {
    Debug.SetUser({
      email: request.email,
      name: request.full_name,
    });
    LogRocketHelper.SetUser({
      email: request.email,
      name: request.full_name,
    });
  }
  
  const response = await api
    .patch(`/auth/investor/register`, body)
    .then((r: any) => {
      return r.data;
    })
    .catch((error: any) => {
      return error.response.data;
    });
  return response;
});