import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { DeepLinkResponse } from '@/models-old/deepLink/deepLink.response';
import { DeepLinkRequest } from '@/models-old/deepLink/deepLink.request';

export const PostDeepLink = createAsyncThunk(
  'deepLink/PostDeepLink',
  async ({ uri, token }: DeepLinkRequest) => {
    const response = await api
      .post(
        `/signup/user/investor/info/campaign/v2`,
        { uri: uri },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r): DeepLinkResponse => {
        return r.data;
      })
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
