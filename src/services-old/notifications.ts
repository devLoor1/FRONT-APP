import { createAsyncThunk } from '@reduxjs/toolkit';
import { ListNotificationsRequest } from '@/models-old/notifications/listNotifications.request';
/* eslint-disable import/prefer-default-export */
import { ListNotificationsResponse } from '@/models-old/notifications/listNotifications.response';
import api from '../services/api';
import { NotificationsConfigResponse } from '@/models-old/notifications/notificationsConfig.response';

export async function GetNotificationsDirect({ pageNumber, pageSize }: ListNotificationsRequest): Promise<ListNotificationsResponse> {
  const params = `pageNumber=${pageNumber}&pageSize=${pageSize}`;
  try {
    const response = await api.get(`/member/notification?${params}`);
    return response.data as ListNotificationsResponse;
  } catch (error: any) {
    console.error('Erro ao buscar notificações:', error);
    return error.response?.data ?? [];
  }
}

export const GetNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async ({ pageNumber, pageSize }: ListNotificationsRequest) => {
    const params = `pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const response = await api
      .get(`/member/notification?${params}`, {})
      .then((r): ListNotificationsResponse => {
        return r.data;
      })
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetNotificationsConfig = createAsyncThunk(
  'notifications/GetNotificationsConfig',
  async () => {
    const response = await api
      .get(`/member/notificationconfig`, {})
      .then((r): NotificationsConfigResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const ChangeNotificationsConfig = createAsyncThunk(
  'notifications/ChangeNotificationsConfig',
  async (request: NotificationsConfigResponse) => {
    const response = await api
      .put(`/member/notificationconfig`, request)
      .then(() => true)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
