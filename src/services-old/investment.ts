import { createAsyncThunk } from '@reduxjs/toolkit';
import { InvestimentDetailResponse } from '@/models-old/investiment/investimentDetail.response';
import { InvestimentDetailRequest } from '@/models-old/investiment/investimentDetail.resquest';
import { InvestimentsRequest } from '@/models-old/investiment/investiments.request';
import { InvestimentsResponse } from '@/models-old/investiment/investiments.response';
import { RatingResponse } from '@/models-old/investiment/rating.response';
import api from '../services/api';

export const GetRating = createAsyncThunk('investiment/rating', async () => {
  const response = await api
    .get(`/investment/invest/chart/rating/v2`)
    .then((r): RatingResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const GetInvestiments = createAsyncThunk(
  'investiment/investimentsList',
  async ({
    pageNumber,
    pageSize,
    filter,
    searchQuery,
    idOpportunity,
    investmentOrder,
    investmentWarranty,
  }: InvestimentsRequest) => {
    let params = `pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (idOpportunity) {
      params = `&${params}&idOpportunity=${idOpportunity}`;
    }
    if (filter) {
      params = `&${params}&${filter}`;
    }
    if (searchQuery) {
      params = `&${params}&searchQuery=${encodeURIComponent(searchQuery)}`;
    }
    if (investmentOrder) {
      params = `&${params}&investmentOrder=${investmentOrder}`;
    }
    if (investmentWarranty) {
      params = `&${params}&investmentWarranty=${investmentWarranty}`;
    }

    const response = await api
      .get(`/investment/invest/v4?${params}`, {})
      .then((r): InvestimentsResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetInvestimentDetail = createAsyncThunk(
  'investiment/investimentDetail',
  async ({ idAppliedInvestment, idProposal, idUserBorrower }: InvestimentDetailRequest) => {
    const response = await api
      .get(
        `/investment/invest/v3/detail/${idAppliedInvestment}/${idProposal}/${idUserBorrower}`,
        {}
      )
      .then((r): InvestimentDetailResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
