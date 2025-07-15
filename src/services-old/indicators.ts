import { createAsyncThunk } from '@reduxjs/toolkit';
import { GeneralIndicatorsResponse } from '@/models-old/indicators/generalIndicators.response';
import { IndividualIndicatorsResponse } from '@/models-old/indicators/individualIndicators.response';
import api from '../services/api';

export const GetGeneralIndicators = createAsyncThunk('indicators/general', async () => {
  const response = await api
    .get(`/investment/invest/chart/investment`)
    .then((r): GeneralIndicatorsResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const GetIndividualIndicators = createAsyncThunk('indicators/individual', async () => {
  const response = await api
    .get(`/investment/invest/chart/wallet/flow`)
    .then((r): IndividualIndicatorsResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});
