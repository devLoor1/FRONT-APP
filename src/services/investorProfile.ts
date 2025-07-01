import { createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';
import { AnswerRequest } from '@/models/Investor/answer.request';
import { ProfileStatusResponse } from '@/models/Investor/profileStatus.response';
import { QuestionResponse } from '@/models/Investor/question.response';

// eslint-disable-next-line import/prefer-default-export
export const GetProfileStatus = createAsyncThunk('investor/status', async () => {
  const response = await api
    .get(`/member/suitability/status/v2`)
    .then((r): ProfileStatusResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const GetQuestion = createAsyncThunk('investor/getQuestion', async (request: number) => {
  const response = await api
    .get(`/member/suitability/next/question?IdLastQuestion=${request}`)
    .then((r): QuestionResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const PostQuestion = createAsyncThunk(
  'investor/postQuestion',
  async (request: AnswerRequest) => {
    const response = await api
      .post(`/member/suitability/answer`, request)
      .then(() => true)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const RedoProfile = createAsyncThunk('investor/RedoProfile', async () => {
  const response = await api
    .get(`/member/suitability/retry`)
    .then(() => true)
    .catch(error => {
      return error.response.data;
    });
  return response;
});
