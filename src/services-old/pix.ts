import { createAsyncThunk } from '@reduxjs/toolkit';
import { BacenRequest } from '@/models/payment/bacen.request';
import { BacenResponse } from '@/models/payment/bacen.response';
import { NewPixKeyRequest } from '@/models/payment/newPixKey.request';
import { PixResponse } from '@/models/payment/pix.response';
import { SendPixRequest } from '@/models/payment/sendPix.request';
import { SendPixResponse } from '@/models/payment/sendPix.response';
import { ConsultTaxPixResponse } from '@/models/payment/consultTaxPix.response';
import AuthStorage from '@/storages/auth-storage';
import api from '../services/api';

export const GetPix = createAsyncThunk('payment/pix', async () => {
  const response = await api
    .get(`/payment/Pix`)
    .then((r): PixResponse => {
      return r.data;
    })
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const VerifyBacen = createAsyncThunk(
  'payment/verifyBacen',
  async ({ keyType, key }: BacenRequest) => {
    const response = await api
      .get(`/payment/Pix/search/${keyType}/${key}/bacen`, {})
      .then((r): BacenResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const VerifyBacenBool = async ({ keyType, key }: BacenRequest) => {
  const token = await AuthStorage.GetPrivateToken();
  try {
    await api.get(`/payment/Pix/search/${keyType}/${key}/bacen`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const RegisterNewPixKey = createAsyncThunk(
  'payment/registerNewPixKey',
  async (request: NewPixKeyRequest) => {
    const response = await api
      .post(`/payment/Pix`, request)
      .then(() => true)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const SendPix = createAsyncThunk('payment/sendPix', async (request: SendPixRequest) => {
  const response = await api
    .post(`/payment/Pix/transfer`, request, {})
    .then((r): SendPixResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const DeletePixKey = createAsyncThunk('payment/deletePixKey', async (idKey: number) => {
  const response = await api
    .delete(`/payment/Pix/${idKey}`)
    .then(() => true)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const ConsultTax = createAsyncThunk('payment/consultTax', async () => {
  const response = await api
    .get(`/payment/pix/taxe/consult`)
    .then((r): ConsultTaxPixResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});
