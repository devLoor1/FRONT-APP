export type PersonalInformationRequest = {
  full_name: string;
  phone: string;
  investor_personal_information: InvestorPersonalInformation;
  address: AddressRequest;
  investor_company_information: Record<string, any>;
  bank_account: BankAccountRequest;
};

export type InvestorPersonalInformation = {
  nationality: string;
  gender: string;
  cpf: string;
  birth_date: string;
  rg: string;
  issuing_entity: string;
  marital_status: string;
  company: string;
  job: string;
  role: string;
  annual_income: number;
  exposed_politically: number;
};

export type AddressRequest = {
  country_id: number;
  zip_code: string;
  street_name: string;
  number: string;
  district: string;
  city: string;
  state: string;
  complement: string | null;
};

export type BankAccountRequest = {
  bank_id: number;
  agency: string;
  account: string;
  account_digit: string;
};
