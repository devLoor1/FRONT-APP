import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { AvailableResponse } from '@/models-old/anticipate/available.response';
import { StatusResponse } from '@/models-old/idWall/status.response';
import { PersonalDataStatusResponse } from '@/models/register/personalDataStatus.response';

export const GetAnticipateStatus = createAsyncThunk('generalStatus/anticipate', async () => {
  const response = await api
    .get(`/investment/anticipation/available`)
    .then((r): AvailableResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const GetReportStatus = createAsyncThunk('generalStatus/idWall', async () => {
  const response = await api
    .get(`/kyc/idwall/relatorio/status`)
    .then((r): StatusResponse => {
      const result = r.data;
      return result;
    })
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const GetPersonalDataStatus = createAsyncThunk('generalStatus/personalData', async () => {
  const response = await api
    .get(`/signup/user/personal/data/status`)
    .then((r): PersonalDataStatusResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});
