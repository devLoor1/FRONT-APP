import { createAsyncThunk } from '@reduxjs/toolkit';
import { PatchIdentifierRequest } from '../models/mfa/patch.identifier.request';
import { IdentifierRequest } from '@/models/mfa/identifier.request';
import { IdentifierResponse } from '@/models/mfa/identifier.response';
import AuthStorage from '@/storages/auth-storage';
import api from './api';
import { DocumentRequest } from '@/models/register/document.request';
import { CepResponse } from '@/models/register/cep.response';
import { ListBanksResponse } from '@/models/register/listBanks.response';
import { CompleteRequest } from '@/models/register/complete.request';
import { PatchIdentifierResponse } from '@/models/mfa/patch.identifier.response';
import { ProfessionListResponse } from '@/models/register/professionList.response';

export const GetIdentifier = createAsyncThunk(
  'register/identifier',
  async (request: IdentifierRequest) => {
    const tokenPublic = await AuthStorage.GetPublicToken();
    const response = await api
      .post(`/mfa/identifier/v2`, request, {
        headers: {
          Authorization: `Bearer ${tokenPublic}`,
        },
      })
      .then((r): IdentifierResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const SendIdentifier = createAsyncThunk(
  'register/sendIdentifier',
  async (request: PatchIdentifierRequest) => {
    const tokenPublic = await AuthStorage.GetPublicToken();

    const response = await api
      .patch(`/mfa/identifier/v3`, request, {
        headers: {
          Authorization: `Bearer ${tokenPublic}`,
        },
      })
      .then((r): PatchIdentifierResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const CompleteRegister = createAsyncThunk(
  'register/CompleteRegister',
  async (request: CompleteRequest) => {
    const token = await AuthStorage.GetPrivateToken();
    const requestPatch = {
      ...request,
      NewAppUser: 1
    }
    const response = await api
      .patch(`/signup/user/investor`, requestPatch, {
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

export const PostDocument = createAsyncThunk(
  'completeRegister/document',
  async (request: DocumentRequest) => {
    const response = await api
      .post(`/signup/user/document/investor`, request)
      .then(() => true)
      .catch(error => {
        return error.response.data;
      });

    return response;
  }
);

export const VerifyIsPublicPerson = createAsyncThunk('completeRegister/isPublicPeson', async () => {
  const response = await api
    .post(`/kyc/know/investor/pld`)
    .then(() => true)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const GetAddress = createAsyncThunk(
  'completeRegister/getAddress',
  async (request: string) => {
    const response = await api
      .get(`https://viacep.com.br/ws/${request}/json`)
      .then((r): CepResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetBanks = createAsyncThunk('completeRegister/getBanks', async () => {
  const response = await api
    .get(`/signup/bank`)
    .then((r): ListBanksResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const UploadDoc = createAsyncThunk(
  'completeRegister/uploadDoc',
  async ({ request, setProgress }: any) => {
    const response = await api
      .post(`/signup/user/upload/file/proof`, request, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      })
      .then(() => true)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const VerifyDoc = createAsyncThunk('completeRegister/verifyDoc', async () => {
  const response = await api
    .post(`/signup/user/verify/file/proof`, {})
    .then(() => true)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const GetProfessionList = createAsyncThunk(
  'completeRegister/GetProfissionList',
  async ({ filter }: { filter: string }) => {
    const response = await api
      .get(`/signup/user/investor/profession?filtro=${filter}`)
      .then((r): ProfessionListResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
