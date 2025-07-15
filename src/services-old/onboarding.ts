import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { ListPublicOpportunitiesResponse } from '@/models/opportunities/publicOpportunities';

export const GetPublicOpportunities = createAsyncThunk(
  'onboarding/GetPublicOpportunities',
  async () => {
    const response = await api
      .get('/investment/public-opportunity')
      .then((r): ListPublicOpportunitiesResponse => {
        return r.data;
      })
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
