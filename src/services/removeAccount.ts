import { createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';
import { RequirementsToRemoveResponse } from '@/models/removeAccount/requirementsToRemove.response';

// eslint-disable-next-line import/prefer-default-export
export const GetRequirementsToRemove = createAsyncThunk(
  'removeAccount/GetRequestToRemove',
  async () => {
    const response = await api
      .get(`/investment/invest/resume/receivable`)
      .then((r): RequirementsToRemoveResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
