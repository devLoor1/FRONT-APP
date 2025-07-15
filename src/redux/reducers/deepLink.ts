import { createSlice } from '@reduxjs/toolkit';
import { DeepLinkResponse } from '@/models-old/deepLink/deepLink.response';
import { PostDeepLink } from '@/services-old/deepLink';
import CommonStorage from '@/storages/common-storage';

const initialState = {
  rDeppLink: <DeepLinkResponse | null>null,
  loading: false,
  requestError: <null | string>null,
};

const deepLinkSlice = createSlice({
  name: 'deepLink',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(PostDeepLink.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.rDeppLink = null;
      })
      .addCase(PostDeepLink.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            CommonStorage.SetDeppLinkId(payload.hash);
            state.rDeppLink = payload;
          }
        }
      });
  },
});

export const { reset } = deepLinkSlice.actions;
export default deepLinkSlice.reducer;
