import { createAsyncThunk } from '@reduxjs/toolkit';
import { BillingDetailRequest } from '@/models/billingCenter/detail.request';
import { BillingDetailResponse } from '@/models/billingCenter/detail.response';
import { BillingListRequest } from '@/models/billingCenter/list.request';
import { BillingListResponse } from '@/models/billingCenter/list.response';
import api from './api';

export const GetBillingList = createAsyncThunk(
  'billingCenter/list',
  async ({ opportunityBillingOrder, pageSize, pageNumber }: BillingListRequest) => {
    let params = `pageNumber=${pageNumber}&pageSize=${pageSize}&`;

    if (opportunityBillingOrder) {
      params = `${params}opportunityBillingOrder=${opportunityBillingOrder}&`;
    }

    const response = await api
      .get(`/billing/billing?${params}`)
      .then((r): BillingListResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetBillingDetail = createAsyncThunk(
  'billingCenter/detail',
  async ({ idOpportunity }: BillingDetailRequest) => {
    const response = await api
      .get(`/billing/billing/details/${idOpportunity}`)
      .then((r): BillingDetailResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
