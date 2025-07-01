import { HomeTabsTypes } from './home';
import { InvestTabsTypes } from './invest';
import { InvestimentTabsTypes } from './investiment';
import { OpportunitiesResponse } from '../opportunities/opportunities.response';
import { InvestimentsResponse } from '../investiment/investiments.response';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  TermsPage: undefined;
  Excerpt: undefined;
  Contact: { preRegister: boolean } | undefined;
  InvestorProfile: undefined;
  AnticipateDetail: undefined;
  FAQ: undefined;
  AnticipateSignature: undefined;
  Menu: undefined;
  Pix: undefined;
  Results: undefined;
  RegisterPixKey: undefined;
  Deposit: { origin: string } | undefined;
  Withdraw: undefined;
  EditProfile: undefined;
  EditInvestorProfile: undefined;
  EditAccount: undefined;
  ChangePassword: undefined;
  RemoveAccount: undefined;
  SettingsAuth: undefined;
  BillingCenter: undefined;
  Anticipate: undefined;
  Privacy: undefined;
  SettingsNotification: undefined;
  Register: undefined;
  Caf: {
    routeConfig?: boolean
  };
  Refused: undefined;
  Profile: undefined;
  ProfilePicture: undefined;
  DailySummary: undefined;
  InvestmentDetail: {
    investment: InvestimentsResponse[0];
  };
  Invest: {
    opportunity: OpportunitiesResponse[0];
    quotasRoute?: number
  };
  Tabs: NavigatorScreenParams<{
    HomeTabs: NavigatorScreenParams<HomeTabsTypes> | undefined;
    InvestTabs: NavigatorScreenParams<InvestTabsTypes> | undefined;
    InvestmentTabs: NavigatorScreenParams<InvestimentTabsTypes> | undefined;
  }>;
  OpportunitiesDetail: {
    opportunity: OpportunitiesResponse[0];
    analytics?: string;
  };
  Profitability: undefined;
};
