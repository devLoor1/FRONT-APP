import { createSlice } from '@reduxjs/toolkit';
import { CodeResponse } from '@/models/recommendation/code.response';
import { GetCodeRecommendation } from '@/services/recommendation';

const initialState = {
  recommendationStatus: <CodeResponse | null>null,
  loading: false,
  requestError: <null | string>null,
};

const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetCodeRecommendation.pending, state => {
        state.loading = true;
      })
      .addCase(GetCodeRecommendation.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.recommendationStatus = <CodeResponse>payload;
          }
        }
      });
  },
});

export const { reset } = recommendationSlice.actions;
export default recommendationSlice.reducer;
