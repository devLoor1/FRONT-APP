import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import type { Me } from "../../models/user/me.response.ts";
import {
  getInvestmentAccessDecision,
  getInvestorAccessStage,
  getRegistrationInitialPage,
} from "./investorAccess.ts";

const approvedUser: Me = {
  avatar: null,
  email: "investidor@example.com",
  full_name: "Pessoa Investidora",
  phone: "+5511999999999",
  type: "pessoa_fisica",
  account_validation_status: "approved",
  reason_for_deny: null,
  has_bureau: true,
  has_address: true,
  has_completed_basic_profile: true,
  has_completed_personal_information: true,
  investor_profile: {
    id: null,
    title: null,
    description: null,
    created_at: null,
  },
  face_match: { status: "approved" },
};

assert.equal(getInvestorAccessStage(approvedUser), "ready");
assert.equal(getRegistrationInitialPage(approvedUser), 5);
assert.equal(getInvestmentAccessDecision(approvedUser).allowed, true);
assert.equal(
  getInvestmentAccessDecision(approvedUser, true).allowed,
  false,
  "suitability only blocks when the WTLB feature requires it",
);

const withProfile: Me = {
  ...approvedUser,
  investor_profile: {
    id: 7,
    title: "Moderado",
    description: null,
    created_at: "2026-09-07T00:00:00.000Z",
  },
};
assert.equal(getInvestmentAccessDecision(withProfile, true).allowed, true);

const incompleteUser: Me = {
  ...approvedUser,
  account_validation_status: "waiting",
  has_completed_basic_profile: false,
  has_completed_personal_information: false,
  face_match: { status: null },
};
assert.equal(getInvestorAccessStage(incompleteUser), "registration");
assert.equal(getRegistrationInitialPage(incompleteUser), 0);

const needsFaceMatch: Me = {
  ...incompleteUser,
  has_completed_basic_profile: true,
  has_completed_personal_information: true,
};
assert.equal(getInvestorAccessStage(needsFaceMatch), "faceMatch");
assert.equal(getRegistrationInitialPage(needsFaceMatch), 4);

const pendingUser: Me = {
  ...approvedUser,
  account_validation_status: "automatic_validation",
  face_match: { status: "waiting_admin_validation" },
};
assert.equal(getInvestorAccessStage(pendingUser), "accountReview");
assert.equal(getRegistrationInitialPage(pendingUser), 5);
assert.equal(getInvestmentAccessDecision(pendingUser).allowed, false);

const deniedUser: Me = {
  ...approvedUser,
  account_validation_status: "denied",
  reason_for_deny: "Dados inconsistentes",
};
assert.equal(getInvestorAccessStage(deniedUser), "accountReview");
assert.equal(
  getInvestmentAccessDecision(deniedUser).message,
  "Dados inconsistentes",
);

const sourceFiles = await Promise.all(
  [
    "../../services/api.ts",
    "../../services/auth.ts",
    "../../services/user.ts",
    "../../services/opportunities.ts",
    "../../services/investments.ts",
  ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
);
const serviceSource = sourceFiles.join("\n");
assert.match(serviceSource, /X-Client-Platform/);
assert.match(serviceSource, /\/app\/onboarding\/login/);
assert.match(serviceSource, /\/app\/onboarding\/face-match/);
assert.match(serviceSource, /\/app\/investors\/opportunities/);
assert.match(serviceSource, /\/app\/investors\/investments/);
assert.doesNotMatch(serviceSource, /boss-equity-api\.herokuapp\.com/);

const passwordSource = await readFile(
  new URL("../../pages/public/PreRegister/pages/Password/index.tsx", import.meta.url),
  "utf8",
);
const registrationSuccessSource = await readFile(
  new URL("../../pages/public/PreRegister/pages/Success/index.tsx", import.meta.url),
  "utf8",
);
assert.doesNotMatch(passwordSource, /userPasswordLogin|AsyncStorage/);
assert.doesNotMatch(registrationSuccessSource, /postLogin|userPasswordLogin/);

const summarySource = await readFile(
  new URL("../../pages/private/Invest/tabs/Summary/index.tsx", import.meta.url),
  "utf8",
);
const investmentTabSource = await readFile(
  new URL("../../pages/private/Invest/tabs/InvestmentTab/index.tsx", import.meta.url),
  "utf8",
);
assert.match(summarySource, /Confirmar investimento/);
assert.match(summarySource, /Ao confirmar, a solicitação de investimento será criada/);
assert.match(investmentTabSource, /anonymous_invest_default/);
assert.match(investmentTabSource, /anonymousOverride \?\? anonymousDefault/);

console.log("functional-parity: 26 assertions passed");
