import { createAsyncThunk } from '@reduxjs/toolkit';
import { PatchIdentifierRequest } from '../models-old/mfa/patch.identifier.request';
import { IdentifierResponse } from '@/models-old/mfa/identifier.response';
import { PasswordRequest } from '@/models-old/lead/password.request';
import Debug from '@/helpers/debug';
import { LeadRequest } from '@/models-old/lead/lead.request';
import { LeadResponse } from '@/models-old/lead/lead.response';
import { InvestimentAmountResponse } from '@/models-old/lead/investimentAmount.response';
import { AuthResponse } from '@/models-old/auth/auth.response';
import { IdentifierLeadRequest } from '@/models-old/mfa/identifierLead.request';
import { LeadMissingResponse } from '@/models-old/lead/leadMissing.response';
import api from '../services/api';
import AuthStorage from '@/storages/auth-storage';
import LogRocketHelper from '@/helpers/logRocket';
import CommonStorage from '@/storages/common-storage';
import { RootState } from '@/redux/store';
import { handleAnalyticsUserProfile } from '@/helpers/analytics';

export const PostLead = createAsyncThunk('lead/PostLead', async (request: LeadRequest) => {
  const getDeepLinkHash = await CommonStorage.GetDeppLinkId();
  let body = { ...request };

  if (getDeepLinkHash) {
    body.HashLeadUserCampaign = getDeepLinkHash;
  }

  if (request.name && request.email) {
    Debug.SetUser({
      email: request.email,
      name: request.name,
    });
    LogRocketHelper.SetUser({
      email: request.email,
      name: request.name,
    });
  }
  const tokenPublic = await AuthStorage.GetPublicToken();
  const response = await api
    .patch(`/signup/user/investor/lead`, body, {
      headers: {
        Authorization: `Bearer ${tokenPublic}`,
      },
    })
    .then((r): LeadResponse => {
      if (getDeepLinkHash) {
        CommonStorage.SetDeppLinkId('');
      }
      return r.data;
    })
    .catch(error => {
      return error.response.data;
    });
  return response;
});

export const GetInvestimentAmountList = createAsyncThunk(
  'lead/GetInvestimentAmountList',
  async () => {
    const tokenPublic = await AuthStorage.GetPublicToken();
    const response = await api
      .get(`/signup/user/intend/invest`, {
        headers: {
          Authorization: `Bearer ${tokenPublic}`,
        },
      })
      .then((r): InvestimentAmountResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetIdentifierLead = createAsyncThunk(
  'lead/GetIdentifierLead',
  async (request: IdentifierLeadRequest) => {
    const tokenPublic = await AuthStorage.GetPublicToken();
    const response = await api
      .post(`/mfa/identifier/leaduser`, request, {
        headers: {
          Authorization: `Bearer ${tokenPublic}`,
        },
      })
      .then((r): IdentifierResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const SendIdentifierEmail = createAsyncThunk(
  'lead/SendIdentifierEmail',
  async (request: PatchIdentifierRequest, { getState }) => {
    const state = getState() as RootState;
    const tokenPublic = await AuthStorage.GetPublicToken();

    const response = await api
      .patch(`/mfa/identifier/leaduser/confirmEmail`, request, {
        headers: {
          Authorization: `Bearer ${tokenPublic}`,
        },
      })
      .then(() => true)
      .catch(error => {
        return error.response.data;
      });

    const email = state.lead.emailUser
    const name = state.lead.nameUser
    const cpf = state.lead.cpfUser
    const birth = state.lead.birthUser
    handleAnalyticsUserProfile('', { Email: email, Name: name, CPF: cpf, Aniversario: birth })
    return response;
  }
);

export const SendIdentifierCellphone = createAsyncThunk(
  'lead/SendIdentifierCellphone',
  async (request: PatchIdentifierRequest, { getState }) => {
    const state = getState() as RootState;
    const tokenPublic = await AuthStorage.GetPublicToken();

    const response = await api
      .patch(`/mfa/identifier/leaduser/confirmCell`, request, {
        headers: {
          Authorization: `Bearer ${tokenPublic}`,
        },
      })
      .then(() => true)
      .catch(error => {
        return error.response.data;
      });

    const cellphone = state.lead.cellphoneUser ? `+55${state.lead.cellphoneUser}` : ''
    handleAnalyticsUserProfile('', { Phone: cellphone })
    return response;
  }
);

export const SendPassword = createAsyncThunk(
  'lead/sendPassword',
  async (request: PasswordRequest) => {
    const tokenPublic = await AuthStorage.GetPublicToken();
    const response = await api
      .post(`/signup/user/capture/lead`, request, {
        headers: {
          Authorization: `Bearer ${tokenPublic}`,
        },
      })
      .then((r): AuthResponse => {
        handleAnalyticsUserProfile('sigIn', { Identity: r.data.hash, RegistroCompleto: true })
        return r.data.token
      })
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetLeadMissing = createAsyncThunk('lead/GetLeadMissing', async (hash: string) => {
  const tokenPublic = await AuthStorage.GetPublicToken();
  const response = await api
    .get(`/signup/user/investor/lead/missingfields?leadHash=${encodeURIComponent(hash)}`, {
      headers: {
        Authorization: `Bearer ${tokenPublic}`,
      },
    })
    .then((r): LeadMissingResponse => r.data)
    .catch(error => {
      return error.response.data;
    });
  return response;
});
