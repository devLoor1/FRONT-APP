import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { ListRequest } from '@/models-old/anticipate/list.request';
import { ListResponse } from '@/models-old/anticipate/list.response';
import { SimulateRequest } from '@/models-old/anticipate/simulate.request';
import { SimulateResponse } from '@/models-old/anticipate/simulate.response';
import { ConfirmResponse } from '@/models-old/anticipate/confirm.response';

export const GetList = createAsyncThunk(
  'anticipate/list',
  async ({ pageNumber, pageSize, idStatusAnticipation }: ListRequest) => {
    let params = `pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (idStatusAnticipation) {
      params += `&idStatusAnticipation=${idStatusAnticipation}`;
    }
    const response = await api
      .get(`/investment/anticipation/invest/v2?${params}`)
      .then((r): ListResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const Simulate = createAsyncThunk(
  'anticipate/Simulate',
  async (request: SimulateRequest) => {
    const response = await api
      .post(`/payment/anticipation/preview`, request)
      .then((r): SimulateResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const ConfirmAnticipate = createAsyncThunk(
  'anticipate/Confirm',
  async (request: SimulateRequest) => {
    const response = await api
      .post(`/payment/anticipation/apply`, request)
      .then((r): ConfirmResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
