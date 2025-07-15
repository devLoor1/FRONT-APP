import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { OpportunitiePJResponse } from '@/models/opportunities/opportunitiePJ.response';
import { FinancialDataResponse } from '@/models/opportunities/financialData.response';
import { CompanyDebtResponse } from '@/models/opportunities/companyDebt.response';
import { RevenueResponse } from '@/models/opportunities/revenue.response';
import { DebtEvolutionResponse } from '@/models/opportunities/debtEvolution.response';
import AuthStorage from '@/storages/auth-storage';

export const GetOpportunitiePJ = createAsyncThunk(
  'opportunitiePJ/getDetail',
  async ({ idOpportunity }: { idOpportunity: number }) => {
    const token = await AuthStorage.GetPublicToken();
    const response = await api
      .get(`/investment/opportunitycompany/general/info/${idOpportunity}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r): OpportunitiePJResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetFinancialData = createAsyncThunk(
  'opportunitiePJ/GetFinancialData',
  async ({ idUser }: { idUser: number }) => {
    const token = await AuthStorage.GetPublicToken();
    const response = await api
      .get(`/investment/opportunitycompany/financial/${idUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r): FinancialDataResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetRating = createAsyncThunk(
  'opportunitiePJ/GetRating',
  async ({ idUser }: { idUser: number }) => {
    const token = await AuthStorage.GetPublicToken();
    const response = await api
      .get(`/investment/opportunitycompany/rating/${idUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r): FinancialDataResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetCompanyDebt = createAsyncThunk(
  'opportunitiePJ/GetCompanyDebt',
  async ({ idUser }: { idUser: number }) => {
    const token = await AuthStorage.GetPublicToken();
    const response = await api
      .get(`/investment/opportunitycompany/company/debt/${idUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r): CompanyDebtResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetRevenue = createAsyncThunk(
  'opportunitiePJ/GetRevenue',
  async ({ idUser }: { idUser: number }) => {
    const token = await AuthStorage.GetPublicToken();
    const response = await api
      .get(`/investment/opportunitycompany/revenue/${idUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r): RevenueResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);

export const GetDebtEvolution = createAsyncThunk(
  'opportunitiePJ/GetDebtEvolution',
  async ({ idUser }: { idUser: number }) => {
    const token = await AuthStorage.GetPublicToken();
    const response = await api
      .get(`/investment/opportunitycompany/debt/evolution/${idUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r): DebtEvolutionResponse => r.data)
      .catch(error => {
        return error.response.data;
      });
    return response;
  }
);
