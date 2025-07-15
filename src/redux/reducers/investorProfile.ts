import { createSlice } from '@reduxjs/toolkit';
import { ProfileStatusResponse } from '@/models-old/Investor/profileStatus.response';
import { QuestionResponse } from '@/models-old/Investor/question.response';
import {
  GetProfileStatus,
  GetQuestion,
  PostQuestion,
  RedoProfile,
} from '@/services-old/investorProfile';

const initialState = {
  profileStatus: <ProfileStatusResponse | null>null,
  question: <QuestionResponse | null>null,
  statusAnswer: <boolean | null>null,
  redoResponse: <boolean | null>null,
  loading: false,
  loadingConfirm: false,
  requestError: <null | string>null,
};

const investorProfileSlice = createSlice({
  name: 'investor',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetProfileStatus.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.profileStatus = null;
        state.question = null;
      })
      .addCase(GetProfileStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.profileStatus = payload;
          }
        }
      })
      .addCase(GetQuestion.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.question = null;
      })
      .addCase(GetQuestion.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.question = payload;
          }
        }
      })
      .addCase(PostQuestion.pending, state => {
        state.loadingConfirm = true;
        state.requestError = null;
        state.statusAnswer = null;
      })
      .addCase(PostQuestion.fulfilled, (state, { payload }) => {
        state.loadingConfirm = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.statusAnswer = payload;
          }
        }
      })
      .addCase(RedoProfile.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.redoResponse = null;
      })
      .addCase(RedoProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.redoResponse = payload;
          }
        }
      });
  },
});

export const { reset } = investorProfileSlice.actions;
export default investorProfileSlice.reducer;
