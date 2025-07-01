import { createSlice } from '@reduxjs/toolkit';
import { ListNotificationsResponse } from '@/models/notifications/listNotifications.response';
import { NotificationsConfigResponse } from '@/models/notifications/notificationsConfig.response';
import {
  ChangeNotificationsConfig,
  GetNotifications,
  GetNotificationsConfig,
} from '@/services/notifications';

const initialState = {
  listNotifications: <ListNotificationsResponse | null>null,
  notificationsConfig: <NotificationsConfigResponse | null>null,
  responseChangeConfig: <boolean | null>null,
  loading: false,
  loadingConfig: false,
  requestError: <null | string>null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetNotifications.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.listNotifications = null;
      })
      .addCase(GetNotifications.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.listNotifications = payload;
          }
        }
      })
      .addCase(GetNotificationsConfig.pending, state => {
        state.loadingConfig = true;
        state.requestError = null;
        state.notificationsConfig = null;
      })
      .addCase(GetNotificationsConfig.fulfilled, (state, { payload }) => {
        state.loadingConfig = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.notificationsConfig = payload;
          }
        }
      })
      .addCase(ChangeNotificationsConfig.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.responseChangeConfig = null;
      })
      .addCase(ChangeNotificationsConfig.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.responseChangeConfig = payload;
          }
        }
      });
  },
});

export const { reset } = notificationsSlice.actions;
export default notificationsSlice.reducer;
