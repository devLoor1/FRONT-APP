import { createAsyncThunk } from '@reduxjs/toolkit';
import { FaqResponse } from '@/models-old/faq/faq.response';
import api from '../services/api';
import { NewsResponse } from '@/models-old/faq/news.response';
import { NewsItemResponse } from '@/models-old/faq/newsItem.response';
import { NewsRequest } from '@/models-old/faq/news.request';

// eslint-disable-next-line import/prefer-default-export
export const GetListFaq = createAsyncThunk('faq/list', async () => {
  const response = await api
    .get(`/member/faq/1`)
    .then((r): FaqResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const GetFAQ = createAsyncThunk(
  'faq/GetFAQ',
  async ({ pageNumber, pageSize }: NewsRequest) => {
    let params = pageNumber || pageSize ? `/?` : '';
    if (pageNumber) {
      params += `${params}pageNumber=${pageNumber}&`;
    }
    if (pageSize) {
      params += `${params}pageNumber=${pageSize}&`;
    }
    const response = await api
      .get(`/investment/faq${params}`)
      .then((r): NewsResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetFAQHightlights = createAsyncThunk(
  'faq/GetFAQHightlights',
  async ({ pageNumber, pageSize }: NewsRequest) => {
    let params = '';

    if (pageNumber) {
      params += `&${params}pageNumber=${pageNumber}`;
    }
    if (pageSize) {
      params += `&${params}pageSize=${pageSize}`;
    }
    const response = await api
      .get(`/investment/faq?highlights=true${params}`)
      .then((r): NewsResponse => {
        return r.data;
      })
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetItemFAQ = createAsyncThunk('faq/GetItemFAQ', async (id: number) => {
  const response = await api
    .get(`/investment/faq/${id}`)
    .then((r): NewsItemResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});
