export type OpportunityDetailsResponse = {
  data: OpportunityDetails;
};

export type OpportunityDetails = {
  id: number;
  about: string;
  business_name: string;
  whatsapp_group?: string | null;
  description: string;
  due_at: string;
  end_at: string;
  image: string;
  modality: string;
  name: string;
  segment: string;
  status: string;
  resource_utilization: ResourceUtilization;
  total_investors?: number;
  entrepreneur?: Entrepreneur;
  goal: Goal;
  investor_profile?: InvestorProfile;
  members: Member[];
  modality_data: ModalityData;
  monetary: Monetary;
  promotional_video_url: string | null;
  extra_images: Array<{ url: string }>;
  content_blocks: string[];
  token_contract_address: string | null;
  gnosis_scan_url: string | null;
};

export enum ResourceUtilization {
  InvestmentInTheOpportunity = "investment_in_the_opportunity",
}

export type Entrepreneur = {
  name: string;
  phone: string;
};

export type Goal = {
  confirmed_payment: number;
  confirmed_payment_percentage: number;
  unconfirmed_payment: number;
  max_goal: number;
  min_goal: number;
  percentage_awaiting_payment: number;
  remaining_quota: number;
};

export type InvestorProfile = {
  title: string;
  description: string;
};

export type Member = {
  avatar: string;
  name: string;
  description: string;
};

export type ModalityData = {
  type?: "equity" | "debt";
  participation: number | string;
  percentage_profitability?: string | null;
  payment_frequency?: string;
  grace_period?: number;
  total_installments?: number;
  single_installment?: boolean;
};

export type Monetary = {
  min_investment_value: number;
  warranty_amount?: number;
};
