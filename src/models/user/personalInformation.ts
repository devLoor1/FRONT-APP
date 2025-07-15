export type PersonalInfo = {
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
  investor_company_information: null;
  address: Address;
  bank_account: BankAccount;
};

export type Address = {
  id: number;
  street_name: string;
  city: string;
  complement: string;
  district: string;
  number: string;
  state: string;
  zip_code: string;
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
