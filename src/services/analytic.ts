import { createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';
import { ActiveSatisfactionResponse } from '@/models/analytic/active.response';
import { PostSatisfactionRequest } from '@/models/analytic/postSatisfaction.response';
import { ListPagesSatisfactionResponse } from '@/models/analytic/listPages.response';

export const ListPagesSatisfaction = createAsyncThunk(
  'analytic/ListPagesSatisfaction',
  async () => {
    const response = await api
      .get(`/analytic/rating/screen`)
      .then((r): ListPagesSatisfactionResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const PostSatisfaction = createAsyncThunk(
  'analytic/PostSatisfaction',
  async (request: PostSatisfactionRequest) => {
    const response = await api
      .post(`/analytic/rating`, request)
      .then(() => true)
      .catch(error => {
        return error.response.data;
      });

    return response;
  }
);

export const ActiveSatisfaction = createAsyncThunk(
  'analytic/ActiveSatisfaction',
  async (screen: string) => {
    const response = await api
      .get(`/analytic/rating/showrating`, {
        headers: {
          screen: screen,
        },
      })
      .then((r): ActiveSatisfactionResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
