import { createAsyncThunk } from '@reduxjs/toolkit';
import { PayRequest } from '@/models/payment/pay.request';
import { WithdrawRequest } from '@/models/payment/withdraw.request';
import { WithdrawResponse } from '@/models/payment/withdraw.response';
import api from './api';

export const SendPay = createAsyncThunk('payment/sendPay', async (request: PayRequest) => {
  const response = await api
    .post(`/payment/pay`, request)
    .then(() => true)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const SendWithdraw = createAsyncThunk(
  'payment/sendWithdraw',
  async (request: WithdrawRequest) => {
    const response = await api
      .post(`/payment/customer/withdraw`, request)
      .then((r): WithdrawResponse => {
        return r.data;
      })
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
