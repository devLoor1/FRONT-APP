export type MeResponse = {
  data: Me;
};

export type Me = {
  email: string;
  full_name: string;
  phone: string;
  type: string;
  account_validation_status: string;
  reason_for_deny: string | null;
  has_completed_personal_information: boolean;
  investor_profile: InvestorProfile;
  face_match: FaceMatch;
};

export type FaceMatch = {
  status: string;
};

export type InvestorProfile = {
  id: number;
  title: string;
  description: string;
  created_at: Date;
};
