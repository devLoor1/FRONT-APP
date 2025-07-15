import { createSlice } from '@reduxjs/toolkit';
import { IdentifierResponse } from '@/models-old/mfa/identifier.response';
import {
  GetIdentifierLead,
  GetInvestimentAmountList,
  GetLeadMissing,
  PostLead,
  SendIdentifierCellphone,
  SendIdentifierEmail,
  SendPassword,
} from '@/services-old/lead';
import { LeadResponse } from '@/models-old/lead/lead.response';
import { InvestimentAmountResponse } from '@/models-old/lead/investimentAmount.response';
import { AuthResponse } from '@/models-old/auth/auth.response';
import { LeadMissingResponse } from '@/models-old/lead/leadMissing.response';

const initialState = {
  hash: <LeadResponse | null>null,
  amountList: <InvestimentAmountResponse | null>null,
  identifierLeadData: <IdentifierResponse | null>null,
  confirmCellphone: <boolean | null>null,
  confirmEmail: <boolean | null>null,
  responsePassword: <AuthResponse | null>null,
  loading: false,
  loadingConfirm: false,
  loadingPost: false,
  loadingFields: false,
  requestError: <null | string>null,
  leadMissingFields: <LeadMissingResponse | null>null,
  cellphoneUser: <string | null>null,
  emailUser: <string | null>null,
  nameUser: <string | null>null,
  cpfUser: <string | null>null,
  birthUser: <string | null>null,
  isWpp: false
};

const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    reset: () => initialState,
    setIsWpp(state, action: { payload: boolean }) {
      state.isWpp = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(PostLead.pending, (state, { meta }) => {
        state.cellphoneUser = meta.arg.cellphone || null
        state.emailUser = meta.arg.email || null
        state.nameUser = meta.arg.name || null
        state.cpfUser = meta.arg.document || null
        state.birthUser = meta.arg.birth?.toLocaleDateString('pt-BR') || null
        state.loadingPost = true;
        state.requestError = null;
      })
      .addCase(PostLead.fulfilled, (state, { payload }) => {
        state.loadingPost = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.hash = payload;
          }
        }
      })
      .addCase(GetInvestimentAmountList.pending, state => {
        state.loading = true;
        state.requestError = null;
        state.amountList = null;
      })
      .addCase(GetInvestimentAmountList.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.amountList = payload;
          }
        }
      })
      .addCase(GetIdentifierLead.pending, state => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(GetIdentifierLead.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.identifierLeadData = payload;
          }
        }
      })
      .addCase(SendIdentifierCellphone.pending, state => {
        state.loadingConfirm = true;
        state.requestError = null;
        state.confirmCellphone = null;
      })
      .addCase(SendIdentifierCellphone.fulfilled, (state, { payload }) => {
        state.loadingConfirm = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.confirmCellphone = payload;
          }
        }
      })
      .addCase(SendIdentifierEmail.pending, state => {
        state.loadingConfirm = true;
        state.requestError = null;
        state.confirmEmail = null;
      })
      .addCase(SendIdentifierEmail.fulfilled, (state, { payload }) => {
        state.loadingConfirm = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.confirmEmail = payload;
          }
        }
      })
      .addCase(SendPassword.pending, state => {
        state.loadingConfirm = true;
        state.requestError = null;
        state.responsePassword = null;
      })
      .addCase(SendPassword.fulfilled, (state, { payload }) => {
        state.loadingConfirm = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.responsePassword = payload;
          }
        }
      })
      .addCase(GetLeadMissing.pending, state => {
        state.requestError = null;
        state.loadingFields = true;
        state.leadMissingFields = null;
      })
      .addCase(GetLeadMissing.fulfilled, (state, { payload }) => {
        state.loadingFields = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.leadMissingFields = payload;
          }
        }
      });
  },
});

export const { reset, setIsWpp } = leadSlice.actions;
export default leadSlice.reducer;
