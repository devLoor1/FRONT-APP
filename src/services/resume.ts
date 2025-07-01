import { createAsyncThunk } from '@reduxjs/toolkit';
import { ResumeResponse } from '@/models/investiment/resume.response';
import { DebitResumeResponse } from '@/models/investiment/debitResume.response';
import api from './api';


export const GetDebit = createAsyncThunk('resume/debit', async () => {
    const response = await api
        .get(`/investment/calc/bad/debit`)
        .then((r): DebitResumeResponse => r.data)
        .catch(error => {
            return error.response.data;
        });
    return response;
});

export const GetDebitWealth = createAsyncThunk('resume/debit/wealth', async () => {
  const response = await api
      .get(`/investment/calc/general/bad/debit`)
      .then((r): DebitResumeResponse => r.data)
      .catch(error => {
          return error.response.data;
      });
  return response;
});

export const GetResume = createAsyncThunk('resume/resume', async () => {
    const response = await api
        .get(`/investment/calc/resume`)
        .then((r): ResumeResponse => r.data)
        .catch(error => {
            return error.response.data;
        });
    return response;
});
