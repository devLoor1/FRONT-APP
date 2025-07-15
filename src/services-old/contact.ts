import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { ListPendenciesResponse } from '@/models-old/contact/listPendencies.response';
import { AdvisorResponse } from '@/models-old/contact/advisor.response';

export const GetPendencies = createAsyncThunk('contact/GetPendencies', async () => {
  const response = await api
    .get(`/member/user/pendencies`, {})
    .then((r): ListPendenciesResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const GetAdvisor = createAsyncThunk('contact/GetAdvisor', async () => {
  const response = await api
    .get(`/member/user/info/advisor`, {})
    .then((r): AdvisorResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const ResetChat = createAsyncThunk('contact/ResetChat', async () => {
  const response = await api
    .post(`/member/blip`)
    .then(() => true)
    .catch(error => {
      return error.response.data;
    });
  return response;
});
