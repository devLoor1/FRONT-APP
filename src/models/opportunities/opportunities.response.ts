export type OpportunitiesResponse = {
  data: Opportunity[];
  meta: Meta;
};

export type Opportunity = {
  id: number;
  description: string;
  due_at: string;
  end_at: string;
  image: string;
  modality: string;
  name: string;
  segment: string;
  status: string;
  goal: Goal;
  investor_profile?: InvestorProfile;
  modality_data: ModalityData;
  monetary: Monetary;
};

export type Goal = {
  remaining_quota: number;
  confirmed_payment: number;
  confirmed_payment_percentage: number;
  unconfirmed_payment: number;
  max_goal: number;
  min_goal: number;
  percentage_awaiting_payment: number;
};

export type InvestorProfile = {
  title: string;
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

export type Meta = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: null;
  previous_page_url: null;
};
