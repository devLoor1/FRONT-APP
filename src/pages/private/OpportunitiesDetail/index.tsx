import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GeneralInfos from "./components/GeneralInfos";
import HeaderDefault from "../../../components/HeaderDefault";
import BtnDefault from "../../../components/BtnDefault";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
// import InvestSimulation from "../../../components/InvestSimulation";
import { useAppSelector } from "../../../redux/hooks";
import LoadingComp from "../../../components/Loading";
import Snack from "@/components/Snack";
import { RootStackParamList } from "@/models/routes/navigation.private";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
// import FinancialData from "./components/FinancialData";
import { Analytics } from "@/helpers/analytics";
import { getOpportunity } from "@/services/opportunities";
import { useQuery } from "@tanstack/react-query";
import { usePlatformTerminology } from "@/features/platform-app/usePlatformTerminology";
import { usePlatformFeatureFlag } from "@/features/platform-app/usePlatformFeatureFlag";
import { getInvestmentAccessDecision } from "@/features/investor-access/investorAccess";

type Props = NativeStackScreenProps<RootStackParamList, "OpportunitiesDetail">;

export default function OpportunitiesDetailPage({ route }: Props) {
  const { resolveTerminology } = usePlatformTerminology();
  const opportunitiesLabel = resolveTerminology(
    "investmentOffering.label.plural",
    "Oportunidades",
  );
  const { opportunityId } = route.params;
  const [showSnack, setShowSnack] = useState(false);
  const [msgError, setMsgError] = useState("");
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [page, setPage] = useState(1);
  const user = useAppSelector((state) => state.auth.user);
  const investorProfileRequired = usePlatformFeatureFlag(
    "investor_profile_enabled",
  );

  const {
    data: opportunity,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [getOpportunity.name, opportunityId],
    queryFn: () => getOpportunity(opportunityId),
    enabled: !!opportunityId,
  });

  const isExpired = opportunity
    ? new Date(opportunity.due_at).getTime() <= Date.now()
    : false;

  const openInvestment = () => {
    if (!opportunity) return;

    if (isExpired) {
      setMsgError("Esta captação já foi encerrada.");
      setShowSnack(true);
      return;
    }

    const access = getInvestmentAccessDecision(user, investorProfileRequired);
    if (!access.allowed) {
      setMsgError(access.message || "Sua conta não está liberada para investir.");
      setShowSnack(true);
      return;
    }

    Analytics({ eventName: "DetOportunidade_InvestirAgora" });
    nav.navigate("Invest", { opportunityId: opportunity.id });
  };

  return (
    <>
      <HeaderDefault
        title={opportunitiesLabel}
        back
        onPressBack={() => {
          if (page === 2) {
            setPage(1);
          } else {
            nav.goBack();
          }
        }}
        analytics="DetOportunidade"
      />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        {loading ? (
          <View style={{ flex: 1 }}>
            <LoadingComp />
          </View>
        ) : isError || !opportunity ? (
          <View
            style={{
              flex: 1,
              padding: 24,
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <Text style={{ textAlign: "center" }}>
              {(error as any)?.response?.data?.message ||
                "Não foi possível carregar esta oportunidade."}
            </Text>
            <BtnDefault label="Tentar novamente" onPress={() => refetch()} />
          </View>
        ) : (
          <>
            {page === 1 && (
              <GeneralInfos setPage={setPage} opportunity={opportunity} />
            )}
            {/* {page === 2 && <FinancialData opportunity={opportunity} />} */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <BtnDefault
                label={isExpired ? "Captação encerrada" : "Investir agora"}
                disabled={isExpired}
                onPress={openInvestment}
              />
            </View>
            {/* <InvestSimulation
              refRBSheet={refRBSheetSimulation}
              opportunity={opportunity}
            /> */}
          </>
        )}

        <Snack visible={showSnack} txt={msgError} setShowSnack={setShowSnack} />
      </SafeAreaView>
    </>
  );
}
