export type InvestmentsResponse = {
  meta: Meta;
  data: Investment[];
};

export type Investment = {
  opportunity_id: number;
  due_at: string;
  modality: string;
  name: string;
  segment: string;
  status: string;
  total_investors: number;
  invested: number;
  goal: Goal;
  modality_data: ModalityData;
  monetary: Monetary;
};

export type Goal = {
  confirmed_payment: number;
  confirmed_payment_percentage: number;
  unconfirmed_payment: number;
  max_goal: number;
  min_goal: number;
  percentage_awaiting_payment: number;
};

export type ModalityData = {
  participation: number;
};

export type Monetary = {
  min_investment_value: number;
};

export type Meta = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string;
  previous_page_url: string;
};
