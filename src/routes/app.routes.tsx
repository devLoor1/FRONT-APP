import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import InvestorProfilePage from '~/pages/private/InvestorProfile';
import Tabs from "./private/Tabs";
import { RootStackParamList } from "@/models/routes/navigation.private";
// import ExcerptPage from '~/pages/private/Excerpt';
// import ContactPage from '~/pages/public/Contact';
// import FaqPage from '~/pages/private/Faq';
// import MenuPage from '~/pages/private/Menu';
// import DepositPage from '~/pages/private/Deposit';
// import WithdrawPage from '~/pages/private/Withdraw';
// import PixPage from '~/pages/private/Pix';
// import ResultsPage from '~/pages/private/Results';
// import EditAccountPage from '~/pages/private/EditAccount';
// import ChangePasswordPage from '~/pages/private/ChangePassword';
import RemoveAccountPage from '@/pages/private/RemoveAccount';
// import SettingsAuthPage from '~/pages/private/SettingsAuth';
// import BillingCenterPage from '~/pages/private/BillingCenter';
// import SettingsNotificationPage from '~/pages/private/SettingsNotification';
// import RegisterPage from '~/pages/private/Register';
// import RefusedPage from '~/pages/private/Refused';
import OpportunitiesDetailPage from "@/pages/private/OpportunitiesDetail";
// import { RootStackParamList } from '~/models/routes/navigation';
import InvestPage from "@/pages/private/Invest";
import RegisterPage from "@/pages/private/Register";
import FaceMatchPage from "@/pages/private/FaceMatch";
import MenuPage from "@/pages/private/Menu";
// import ProfilePage from '~/pages/private/Profile';
// import InvestmentDetailPage from '~/pages/private/InvestmentDetail';
// import ProfilePicturePage from '~/pages/private/ProfilePicture';
// import DailySummaryPage from '~/pages/private/DailySummary';
// import ProfitabilityPage from '~/pages/private/Profitability';
// import Caf from '~/pages/private/Register/pages/Caf';

const MainStack = createNativeStackNavigator<RootStackParamList>();

export default function AppRoutes({
  firstPage,
}: {
  firstPage: keyof RootStackParamList;
}) {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={firstPage}
    >
      <MainStack.Screen
        component={Tabs}
        name="Tabs"
        options={{ gestureEnabled: false }}
      />
      <MainStack.Screen
        name="Register"
        component={RegisterPage}
        options={{ gestureEnabled: false }}
      />
      <MainStack.Screen
        name="FaceMatch"
        component={FaceMatchPage}
        options={{ gestureEnabled: false }}
      />
      <MainStack.Screen name="Menu" component={MenuPage} />
      <MainStack.Screen
        name="OpportunitiesDetail"
        component={OpportunitiesDetailPage}
      />
      <MainStack.Screen name="Invest" component={InvestPage} />
      <MainStack.Screen name="RemoveAccount" component={RemoveAccountPage} />
      {/* <MainStack.Screen name="DailySummary" component={DailySummaryPage} /> */}
      {/* <MainStack.Screen
        name="InvestmentDetail"
        component={InvestmentDetailPage}
      />
      <MainStack.Screen name="Excerpt" component={ExcerptPage} />
      <MainStack.Screen name="Contact" component={ContactPage} />
      <MainStack.Screen
        name="InvestorProfile"
        component={InvestorProfilePage}
      />
      <MainStack.Screen name="FAQ" component={FaqPage} />
      
      <MainStack.Screen name="Pix" component={PixPage} />
      <MainStack.Screen name="Results" component={ResultsPage} />
      <MainStack.Screen name="Deposit" component={DepositPage} />
      <MainStack.Screen name="Withdraw" component={WithdrawPage} />
      <MainStack.Screen name="EditAccount" component={EditAccountPage} />
      <MainStack.Screen name="ChangePassword" component={ChangePasswordPage} />
      
      <MainStack.Screen name="SettingsAuth" component={SettingsAuthPage} />
      <MainStack.Screen name="BillingCenter" component={BillingCenterPage} />
      <MainStack.Screen
        name="SettingsNotification"
        component={SettingsNotificationPage}
      />
      <MainStack.Screen name="Profile" component={ProfilePage} />
      <MainStack.Screen name="ProfilePicture" component={ProfilePicturePage} />
      <MainStack.Screen name="Profitability" component={ProfitabilityPage} />
      <MainStack.Screen name="Caf" component={Caf} />
      <MainStack.Screen
        name="Refused"
        component={RefusedPage}
        options={{ gestureEnabled: false }}
      /> */}
    </MainStack.Navigator>
  );
}
