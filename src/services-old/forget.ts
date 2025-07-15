import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { NewPasswordRequest } from '@/models-old/forget/patch.newPassword.request';

export const SendNewPassword = createAsyncThunk(
  'forget/newPassword',
  async ({ request, token }: { request: NewPasswordRequest; token: string }) => {
    const response = await api
      .patch(`/member/user/recovery/password`, request, {
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
