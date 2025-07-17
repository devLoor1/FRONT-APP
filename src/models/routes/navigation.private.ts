import { HomeTabsTypes } from "../../models-old/routes/home";
import { InvestTabsTypes } from "../../models-old/routes/invest";
import { InvestimentTabsTypes } from "../../models-old/routes/investiment";
import { OpportunitiesResponse } from "../opportunities/opportunities.response";
import { InvestimentsResponse } from "../../models-old/investiment/investiments.response";
import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<{
    HomeTabs: NavigatorScreenParams<HomeTabsTypes> | undefined;
    InvestTabs: NavigatorScreenParams<InvestTabsTypes> | undefined;
    InvestmentTabs: NavigatorScreenParams<InvestimentTabsTypes> | undefined;
  }>;
  Menu: undefined;
  Register: undefined;
  OpportunitiesDetail: {
    opportunityId: OpportunitiesResponse["data"][0]["id"];
    analytics?: string;
  };
  Invest: {
    opportunityId: OpportunitiesResponse["data"][0]["id"];
    quotasRoute?: number;
  };

  // TermsPage: undefined;
  // Excerpt: undefined;
  // Contact: { preRegister: boolean } | undefined;
  // InvestorProfile: undefined;
  // AnticipateDetail: undefined;
  // FAQ: undefined;
  // AnticipateSignature: undefined;
  // 
  // Pix: undefined;
  // Results: undefined;
  // RegisterPixKey: undefined;
  // Deposit: { origin: string } | undefined;
  // Withdraw: undefined;
  // EditProfile: undefined;
  // EditInvestorProfile: undefined;
  // EditAccount: undefined;
  // ChangePassword: undefined;
  // RemoveAccount: undefined;
  // SettingsAuth: undefined;
  // BillingCenter: undefined;
  // Anticipate: undefined;
  // Privacy: undefined;
  // SettingsNotification: undefined;
  // Caf: {
  //   routeConfig?: boolean;
  // };
  // Refused: undefined;
  // Profile: undefined;
  // ProfilePicture: undefined;
  // DailySummary: undefined;
  // InvestmentDetail: {
  //   investment: InvestimentsResponse[0];
  // };
  // Profitability: undefined;
};
