import { createSlice } from '@reduxjs/toolkit';
import { ExcerptResponse } from '@/models-old/excerpt/excerpt.response';
import { GetExcerpt, PostExcerpstEmail } from '@/services-old/excerpt';

const initialState = {
  listExcerpt: <ExcerptResponse | null>null,
  loading: false,
  isListEnd: false,
  requestError: <null | string>null,
};

const excerptSlice = createSlice({
  name: 'excerpt',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetExcerpt.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(GetExcerpt.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          state.listExcerpt = <ExcerptResponse>payload;
        }
      })
      .addCase(GetExcerpt.rejected, (state, { error }) => {
        state.loading = false;
        state.requestError = error.message || null;
      })
      .addCase(PostExcerpstEmail.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(PostExcerpstEmail.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          }
        }
      });
  },
});

export const { reset } = excerptSlice.actions;
export default excerptSlice.reducer;
