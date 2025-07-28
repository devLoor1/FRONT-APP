export type PersonalInformationResponse = {
  full_name: string;
  phone: string;
  nationality: string;
  gender: string;
  cpf: string;
  rg: string;
  issuing_entity: string;
  marital_status: string;
  company: string;
  job: string;
  role: string;
  annual_income: number;
  exposed_politically: number;
  birth_date: string;
  investor_company_information: InvestorCompanyInformation | null;
  address: Address;
  bank_account: BankAccount;
};

export type InvestorCompanyInformation = {
  name: string;
  fantasy_name: string;
  cnpj: string;
  type: string;
};

export type Address = {
  id: number;
  zip_code: string;
  street_name: string;
  number: string;
  district: string;
  city: string;
  state: string;
  complement: string;
  country: Country;
};

export type Country = {
  id: number;
  name: string;
  abbreviation: string;
};

export type BankAccount = {
  bank_id: number;
  agency: string;
  account: string;
  account_digit: string;
}; 