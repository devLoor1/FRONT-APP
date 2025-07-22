export type InvestmentRequest = {
  opportunity_id: string;
  quota_quantity: number;
  declaration:
    | "less_than_or_equal_200_thousand"
    | "greater_than_200_thousand_less_than_1_million"
    | "greater_than_or_equal_1_million";
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
