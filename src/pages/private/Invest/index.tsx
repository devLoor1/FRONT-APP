import React, { useEffect, useRef, useState } from "react";
import {
  SceneRendererProps,
  TabBar,
  TabBarItem,
  TabView,
} from "react-native-tab-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
// import Coupon from './components/Coupon';
import { RootStackParamList } from "@/models/routes/navigation.private";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import SuccessPage from "./components/Success";
import { useTheme } from "@/context/MyThemeContext";
import HeaderDefault from "@/components/HeaderDefault";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SendPay } from "@/services-old/payment";
import { Analytics } from "@/helpers/analytics";
import BottomsheetAuth from "@/components/BottomsheetAuth";
import Snack from "@/components/Snack";
import { getOpportunity } from "@/services/opportunities";
import RBSheetRef from "@/helpers/types/rawBottomSheetRef";
import InvestmentTab from "./tabs/InvestmentTab";
import PersonalDataTab, { PersonalDataForm } from "./tabs/PersonalDataTab";
import { BackHandler, Text } from "react-native";
import CrowdfundingTab from "./tabs/Crowdfunding";
import { InvestmentRequest } from "@/models/investments/investment.request";
import Summary from "./tabs/Summary";
import FinishTab from "./tabs/FinishTab";
import { usePlatformTerminology } from "@/features/platform-app/usePlatformTerminology";

type Props = NativeStackScreenProps<RootStackParamList, "Invest">;

export default function InvestPage({ route }: Props) {
  const { resolveTerminology } = usePlatformTerminology();
  const opportunitiesLabel = resolveTerminology(
    "investmentOffering.label.plural",
    "Oportunidades",
  );
  const dispatch = useAppDispatch();
  // const refRBSheetCoupon = useRef<any>();
  const refRBSheetInvestorProfile = useRef<RBSheetRef>(null);
  const { theme } = useTheme();
  const [quotas, setQuotas] = useState("1");
  const [page, setPage] = useState(1);
  const { opportunityId, quotasRoute } = route.params;
  const [tot, setTot] = useState(0);
  const refRBSheet = useRef<RBSheetRef>(null);
  const [showSnack, setShowSnack] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [finishedAnimation, setFinishedAnimation] = useState(false);
  const [index, setIndex] = React.useState(0);
  const [investmentData, setInvestmentData] = useState<
    Partial<InvestmentRequest>
  >({});

  const onOpen = () => {
    refRBSheet.current?.open();
  };

  if (page === 2) {
    return <SuccessPage />;
  }

  const onNext = (data: Partial<InvestmentRequest>) => {
    setInvestmentData((prev) => (prev ? { ...prev, ...data } : data));
  };

  const routes = [
    { key: "investment", title: "Investimento" },
    { key: "personal_data", title: "Dados Pessoais" },
    { key: "crowdfunding", title: "Crowdfunding" },
    { key: "summary", title: "Revisão" },
    { key: "finish", title: "Conclusão" },
  ];

  const renderScene = ({
    route,
    ...props
  }: SceneRendererProps & {
    route: { key: string; title: string };
  }) => {
    switch (route.key) {
      case "investment":
        return <InvestmentTab {...{ onNext, opportunityId, ...props }} />;
      case "personal_data":
        return <PersonalDataTab {...{ onNext, opportunityId, ...props }} />;
      case "crowdfunding":
        return <CrowdfundingTab {...{ onNext, ...props }} />;
      case "summary":
        return (
          <Summary
            {...{
              onNext,
              ...props,
              summary: investmentData,
              opportunityId,
              currentTab: index === 3,
            }}
          />
        );
      case "finish":
        return (
          <FinishTab
            {...{
              ...props,
              data: investmentData as InvestmentRequest,
              currentTab: index === 4,
            }}
          />
        );
      default:
        return null;
    }
  };

  const gotToPreviousTab = () => {
    if (index === 0 || index === 4) return false;
    setIndex((i) => i - 1);
    return true;
  };

  useEffect(() => {
    let sub = BackHandler.addEventListener(
      "hardwareBackPress",
      gotToPreviousTab
    );

    return () => {
      sub.remove();
    };
  }, [gotToPreviousTab]);

  useEffect(
    () => () => {
      setIndex(0);
    },
    []
  );

  return (
    <>
      <HeaderDefault
        back
        contact
        help
        title={opportunitiesLabel}
        onPressBack={index === 0 || index === 4 ? undefined : gotToPreviousTab}
      />

      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <TabView
          lazy
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          swipeEnabled={false}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              scrollEnabled
              tabStyle={{ width: "auto", paddingHorizontal: 16 }}
              style={{
                backgroundColor: "transparent",
                elevation: 0,
              }}
              indicatorStyle={{
                backgroundColor: theme.colors.primary,
                height: 3,
              }}
              contentContainerStyle={{ height: 40 }}
              android_ripple={{ borderless: false, color: "transparent" }}
              onTabPress={({ preventDefault }) => preventDefault()}
              renderTabBarItem={(props) => (
                <TabBarItem
                  {...props}
                  key={props.route.key}
                  labelStyle={{ width: "100%" }}
                  label={({ focused, route }) => (
                    <Text
                      adjustsFontSizeToFit
                      style={{
                        includeFontPadding: false,
                        fontFamily: focused
                          ? theme.fonts.bold
                          : theme.fonts.regular,
                        color: theme.colors.text,
                        fontSize: 12,
                      }}
                    >
                      {route.title}
                    </Text>
                  )}
                />
              )}
            />
          )}
        />
      </SafeAreaView>
      {/* <Coupon refRBSheet={refRBSheetCoupon} /> */}
      {/* <InvestorProfileBottom
        investorProfile={me?.investor_profile}
        refRBSheet={refRBSheetInvestorProfile}
        handleContinue={onOpen}
      /> */}
      {/* <BottomsheetAuth
        refRBSheet={refRBSheet}
        setFinishedAnimation={setFinishedAnimation}
        confirm={confirmInvestiment}
        pageHasAuth={true}
        textAnimation="investimento"
        valueToTransfer={tot}
        titleTxt="Validar Investimento"
        operation="ApplyInvestment"
        analytics="ValidarInvestimento"
      /> */}
      <Snack visible={showSnack} txt={msgError} setShowSnack={setShowSnack} />
    </>
  );
}
