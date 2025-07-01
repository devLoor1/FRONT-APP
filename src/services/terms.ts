import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetNewTemsResponse } from '@/models/terms/getNewTems.response';
import { NewTermsAgreeRequest } from '@/models/terms/newTems.agree.request';
import { VerifyNewTemsResponse } from '@/models/terms/verifyNewTems.response';
import AuthStorage from '@/storages/auth-storage';
import api from './api';

export const VerifyNewTerms = createAsyncThunk('terms/verifyNewTerms', async () => {
  const token = await AuthStorage.GetPrivateToken();
  const response = await api
    .get(`/agreements/term/has/new`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((r): VerifyNewTemsResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const GetNewTerms = createAsyncThunk('terms/getNewTerms', async () => {
  const token = await AuthStorage.GetPrivateToken();
  const response = await api
    .get(`/agreements/term/new/v2?profile=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((r): GetNewTemsResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const AcceptNewTerms = createAsyncThunk(
  'terms/acceptNewTerms',
  async (request: NewTermsAgreeRequest) => {
    const token = await AuthStorage.GetPrivateToken();
    const response = await api
      .post(`/agreements/agree/new/term`, request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => true)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
