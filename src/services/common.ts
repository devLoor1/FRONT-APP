import api from "./api";
import { Segments } from "@/models/opportunities/segments.response";
import { Country } from "@/models/common/country";
import { BanksResponse } from "@/models/user/banks.response";
import { CepResponse } from "@/models/register/cep.response";
import { BureauResponse } from "@/models/user/bureau.response";

export const getSegments = async () => {
  const response = await api.get<Segments>("/segments");

  return response.data.data;
};

export const getCountries = async () => {
  const response = await api.get<{ data: Country[] }>("/countries");

  return response.data.data;
};

export const getBanks = async () => {
  const response = await api.get<BanksResponse>("/investors/banks");

  return response.data;
};

export const getCepInfo = async (cep: string) => {
  const response = await api.get<CepResponse>(`/cep/${cep}`);
  return response.data;
};

export const getBureauByCpf = async (cpf: string) => {
  const response = await api.post<BureauResponse>(`/investors/bureau/${cpf}`);
  return response.data;
};
