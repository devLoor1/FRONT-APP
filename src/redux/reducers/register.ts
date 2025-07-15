import { createSlice } from '@reduxjs/toolkit';
import { IdentifierResponse } from '@/models-old/mfa/identifier.response';
import {
  CompleteRegister,
  GetAddress,
  GetBanks,
  GetIdentifier,
  GetProfessionList,
  PostDocument,
  SendIdentifier,
  UploadDoc,
  VerifyDoc,
  VerifyIsPublicPerson,
} from '@/services-old/register';
import { CepResponse } from '@/models/register/cep.response';
import { ListBanksResponse } from '@/models/register/listBanks.response';
import { VerifyDocResponse } from '@/models/register/verifyDoc.response';
import { PatchIdentifierResponse } from '@/models-old/mfa/patch.identifier.response';
import { ProfessionListResponse } from '@/models/register/professionList.response';

const initialState = {
  identifierData: <IdentifierResponse | null>null,
  newIdentifierData: <PatchIdentifierResponse | null>null,
  sendDocument: <boolean | null>null,
  isntPublicPerson: <boolean | null>null,
  completeAddress: <CepResponse | null>null,
  listBanks: <ListBanksResponse | null>null,
  docResponse: <boolean | null>null,
  docStatus: <VerifyDocResponse | null>null,
  responseComplete: <boolean | null>null,
  loading: false,
  loadingDoc: false,
  loadingConfirm: false,
  loadingBanks: false,
  requestError: <null | string>null,
  professionList: <ProfessionListResponse | null>null,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    reset: () => initialState,
    resetDocs: state => {
      state.loadingDoc = false;
      state.docResponse = null;
      state.docStatus = null;
    },
    resetIdentifier: state => {
      state.newIdentifierData = null;
      state.identifierData = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(GetIdentifier.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(GetIdentifier.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.identifierData = payload;
          }
        }
      })
      .addCase(SendIdentifier.pending, state => {
        state.loadingConfirm = true;
        state.requestError = null;
        state.newIdentifierData = null;
      })
      .addCase(SendIdentifier.fulfilled, (state, { payload }) => {
        state.loadingConfirm = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.newIdentifierData = payload;
          }
        }
      })
      .addCase(CompleteRegister.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.responseComplete = null;
      })
      .addCase(CompleteRegister.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.responseComplete = payload;
          }
        }
      })
      .addCase(PostDocument.pending, state => {
        state.loadingConfirm = true;
        state.requestError = null;
      })
      .addCase(PostDocument.fulfilled, (state, { payload }) => {
        state.loadingConfirm = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.sendDocument = payload;
          }
        }
      })
      .addCase(VerifyIsPublicPerson.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(VerifyIsPublicPerson.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.isntPublicPerson = payload;
          }
        }
      })
      .addCase(GetAddress.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(GetAddress.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.erro) {
            state.requestError = 'CEP não encontrado!';
          } else {
            state.completeAddress = <CepResponse>payload;
          }
        }
      })
      .addCase(GetBanks.pending, state => {
        state.loadingBanks = true;
        state.requestError = null;
      })
      .addCase(GetBanks.fulfilled, (state, { payload }) => {
        state.loadingBanks = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.listBanks = <ListBanksResponse>payload;
          }
        }
      })
      .addCase(UploadDoc.pending, state => {
        state.loadingDoc = true;
        state.requestError = null;
        state.docResponse = null;
      })
      .addCase(UploadDoc.fulfilled, (state, { payload }) => {
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
            state.loadingDoc = false
          } else {
            state.docResponse = payload;
          }
        }
      })
      .addCase(VerifyDoc.pending, state => {
        state.requestError = null;
        state.docStatus = null;
      })
      .addCase(VerifyDoc.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          state.docStatus = payload;
        }
      })
      .addCase(GetProfessionList.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.professionList = null;
      })
      .addCase(GetProfessionList.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.professionList = payload;
          }
        }
      });
  },
});

export const { reset, resetDocs, resetIdentifier } = registerSlice.actions;
export default registerSlice.reducer;
