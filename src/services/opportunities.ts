import { createAsyncThunk } from '@reduxjs/toolkit';
import { CodeRequest } from '@/models/opportunities/code.request';
import { OpportunitiesRequest } from '@/models/opportunities/opportunities.request';
import { OpportunitiesResponse } from '@/models/opportunities/opportunities.response';
import { SendCodeRequest } from '@/models/opportunities/sendCode.request';
import api from './api';
import AuthStorage from '@/storages/auth-storage';

export const GetOpportunities = createAsyncThunk(
  'opportunities/list',
  async ({
    pageNumber,
    pageSize,
    opportunityInvested,
    codeOpportunity,
    shortOrder,
    filter,
    searchQuery,
    idOpportunity,
  }: OpportunitiesRequest) => {
    const token = await AuthStorage.GetPublicToken();
    let params = '';
    if (pageNumber) {
      params = `pageNumber=${pageNumber}&`;
    }
    if (pageSize) {
      params = `${params}pageSize=${pageSize}&`;
    }
    if (opportunityInvested) {
      params = `${params}opportunityInvested=${opportunityInvested}&`;
    }
    if (codeOpportunity) {
      params = `${params}codeOpportunity=${codeOpportunity}&`;
    }
    if (shortOrder) {
      params = `${params}shortOrder=${shortOrder}&`;
    }
    if (searchQuery?.trim()) {
      params = `${params}SearchQuery=${encodeURIComponent(searchQuery.trim())}&`;
    }
    if (idOpportunity) {
      params = `${params}idOpportunity=${idOpportunity}&`;
    }
    if (filter && typeof filter === 'object') {
      Object.keys(filter).forEach(key => {
        const value = filter[key];
        if (Array.isArray(value)) {
          value.forEach((item: string) => {
            params = `${params}${key}=${item}&`;
          });
        } else {
          params = `${params}${key}=${value}&`;
        }
      });
    }

    if (params.endsWith('&')) {
      params = params.slice(0, -1);
    }

    const response = await api
      .get(`/investment/opportunity/v3/?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r): OpportunitiesResponse => {
        return r.data;
      })
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetCode = createAsyncThunk('opportunities/getCode', async (request: CodeRequest) => {
  const response = await api
    .post(`/mfa/identifier/v2/secure/transaction`, request)
    .then(() => true)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const SendCode = createAsyncThunk(
  'opportunities/SendCode',
  async ({ code, reason }: SendCodeRequest) => {
    const response = await api
      .patch(`/mfa/identifier/v2/secure/transaction/${code}`, { reason })
      .then(() => true)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
