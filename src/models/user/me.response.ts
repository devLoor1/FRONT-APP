export type MeResponse = {
  data: Me;
};

export type Me = {
  avatar: string | null;
  email: string;
  full_name: string;
  phone: string;
  type: string;
  account_validation_status: AccountValidationStatus;
  reason_for_deny: string | null;
  has_bureau: boolean;
  has_address: boolean;
  has_completed_basic_profile: boolean;
  has_completed_personal_information: boolean;
  investor_profile: InvestorProfile;
  face_match: FaceMatch;
};

export type FaceMatch = {
  status: FaceMatchStatus | null;
};

export type InvestorProfile = {
  id: number | null;
  title: string | null;
  description: string | null;
  created_at: string | null;
};

export type AccountValidationStatus =
  | "waiting"
  | "automatic_validation"
  | "manual_validation"
  | "approved"
  | "denied";

export type FaceMatchStatus =
  | "refused_by_api"
  | "waiting_admin_validation"
  | "approved"
  | "denied";
