import type { Me } from "@/models/user/me.response";

export type InvestorAccessStage =
  | "registration"
  | "faceMatch"
  | "accountReview"
  | "ready";

export type InvestmentAccessDecision = {
  allowed: boolean;
  message?: string;
};

export function getInvestorAccessStage(user: Me | null): InvestorAccessStage {
  if (!user) return "registration";

  if (user.account_validation_status === "denied") {
    return "accountReview";
  }

  if (
    !user.has_completed_basic_profile ||
    !user.has_completed_personal_information
  ) {
    return "registration";
  }

  const faceMatchStatus = user.face_match?.status;
  if (!faceMatchStatus || faceMatchStatus === "refused_by_api") {
    return "faceMatch";
  }

  if (
    faceMatchStatus !== "approved" ||
    user.account_validation_status !== "approved"
  ) {
    return "accountReview";
  }

  return "ready";
}

export function getRegistrationInitialPage(user: Me | null): number {
  switch (getInvestorAccessStage(user)) {
    case "faceMatch":
      return 4;
    case "accountReview":
    case "ready":
      return 5;
    default:
      return 0;
  }
}

export function getInvestmentAccessDecision(
  user: Me | null,
  investorProfileRequired = false,
): InvestmentAccessDecision {
  const stage = getInvestorAccessStage(user);

  if (stage === "registration") {
    return {
      allowed: false,
      message: "Complete seus dados cadastrais antes de investir.",
    };
  }

  if (stage === "faceMatch") {
    return {
      allowed: false,
      message: "Conclua a validação de identidade antes de investir.",
    };
  }

  if (stage === "accountReview") {
    return {
      allowed: false,
      message:
        user?.account_validation_status === "denied"
          ? user.reason_for_deny || "Sua conta não está liberada para investir."
          : "Sua conta ainda está em análise e não foi liberada para investir.",
    };
  }

  if (
    investorProfileRequired &&
    !user?.investor_profile?.id &&
    !user?.investor_profile?.title
  ) {
    return {
      allowed: false,
      message: "Defina seu perfil de investidor antes de investir.",
    };
  }

  return { allowed: true };
}
