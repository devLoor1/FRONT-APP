export type InvestmentRequest = {
  opportunity_id: string;
  quota_quantity: string;
  declaration: string;
  anonymous: boolean;
  other_crowdfunding_platforms: number;
  investor_personal_information: InvestorPersonalInformation;
  address: Address;
  pix: Pix;
  investor_company_information?: InvestorCompanyInformation;
  user_agreed_to_continue: boolean;
  user_agreed_at: Date;
};

export type Address = {
  country_id: string;
  zip_code: string;
  street_name: string;
  number: string;
  district: string;
  city: string;
  state: string;
  complement: string;
};

export type InvestorCompanyInformation = {
  cnpj: string;
};

export type InvestorPersonalInformation = {
  nationality: string;
  gender: string;
  cpf: string;
  rg: string;
  issuing_entity: string;
  marital_status: string;
  company: string;
  job: string;
  role: string;
  exposed_politically: boolean;
  birth_date: string;
};

export type Pix = {
  type: string;
  key: string;
};
