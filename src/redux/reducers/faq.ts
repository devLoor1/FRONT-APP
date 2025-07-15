import { createSlice } from '@reduxjs/toolkit';
import { FaqResponse } from '@/models-old/faq/faq.response';
import { NewsResponse } from '@/models-old/faq/news.response';
import { NewsItemResponse } from '@/models-old/faq/newsItem.response';
import { GetFAQ, GetFAQHightlights, GetItemFAQ, GetListFaq } from '@/services-old/faq';

const initialState = {
  faqList: <FaqResponse | null>null,
  highlightsList: <NewsResponse | null>null,
  newsList: <NewsResponse | null>null,
  newsItem: <NewsItemResponse | null>null,
  loading: false,
  loadingList: false,
  requestError: <null | string>null,
};

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetListFaq.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(GetListFaq.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.faqList = payload;
          }
        }
      })
      .addCase(GetFAQ.pending, state => {
        state.loadingList = true;
        state.requestError = null;
      })
      .addCase(GetFAQ.fulfilled, (state, { payload }) => {
        state.loadingList = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.newsList = payload;
          }
        }
      })
      .addCase(GetFAQHightlights.pending, state => {
        state.loadingList = true;
        state.requestError = null;
      })
      .addCase(GetFAQHightlights.fulfilled, (state, { payload }) => {
        state.loadingList = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.highlightsList = payload;
          }
        }
      })
      .addCase(GetItemFAQ.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(GetItemFAQ.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.newsItem = payload;
          }
        }
      });
  },
});

export const { reset } = faqSlice.actions;
export default faqSlice.reducer;
