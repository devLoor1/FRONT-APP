import { createSlice } from '@reduxjs/toolkit';
import { DebitResumeResponse } from '@/models/investiment/debitResume.response';
import { ResumeResponse } from '@/models/investiment/resume.response';
import { GetResume } from '@/services/resume';
import { GetDebit } from '@/services/resume';
import { GetDebitWealth } from '@/services/resume';

const initialState = {
    resume: <ResumeResponse | null>null,
    debit: <DebitResumeResponse | null>null,
    debitWealth: <DebitResumeResponse | null>null,
    loadingResume: true,
    loadingDebit: true,
    requestError: <null | string>null,
};

const resumeSlice = createSlice({
    name: 'results',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: builder => {
        builder
            .addCase(GetResume.pending, state => {
                state.loadingResume = true;
                state.resume = null;
            })
            .addCase(GetResume.fulfilled, (state, { payload }) => {
                state.loadingResume = false;
                if (payload) {
                    if (payload.message) {
                        state.requestError = payload.message;
                    } else {
                        state.resume = payload;
                    }
                }
            })
            .addCase(GetDebit.pending, state => {
                state.loadingDebit = true;
                state.debit = null;
            })
            .addCase(GetDebit.fulfilled, (state, { payload }) => {
                state.loadingDebit = false;
                if (payload) {
                    if (payload.message) {
                        state.requestError = payload.message;
                    } else {
                        state.debit = payload;
                    }
                }
            })

            .addCase(GetDebitWealth.pending, state => {
              state.loadingDebit = true;
              state.debitWealth = null;
            })
            .addCase(GetDebitWealth.fulfilled, (state, { payload }) => {
                state.loadingDebit = false;
                if (payload) {
                    if (payload.message) {
                        state.requestError = payload.message;
                    } else {
                        state.debitWealth = payload;
                    }
                }
            })
    },
});

export const { reset } = resumeSlice.actions;
export default resumeSlice.reducer;
