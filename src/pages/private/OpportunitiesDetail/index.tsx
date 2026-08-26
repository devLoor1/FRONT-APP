import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GeneralInfos from "./components/GeneralInfos";
import HeaderDefault from "../../../components/HeaderDefault";
import BtnDefault from "../../../components/BtnDefault";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
// import InvestSimulation from "../../../components/InvestSimulation";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import LoadingComp from "../../../components/Loading";
import { reset } from "@/redux/reducers/opportunitiePJ";
import { GetOpportunitiePJ } from "@/services-old/opportunitiePJ";
import Snack from "@/components/Snack";
import { RootStackParamList } from "@/models/routes/navigation.private";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
// import FinancialData from "./components/FinancialData";
import { useAuth } from "@/context/auth";
import handleInvest from "@/helpers/handleInvest";
import { Analytics } from "@/helpers/analytics";
import { getOpportunity } from "@/services/opportunities";
import { useQuery } from "@tanstack/react-query";
import { usePlatformTerminology } from "@/features/platform-app/usePlatformTerminology";

type Props = NativeStackScreenProps<RootStackParamList, "OpportunitiesDetail">;

export default function OpportunitiesDetailPage({ route }: Props) {
  const { resolveTerminology } = usePlatformTerminology();
  const opportunitiesLabel = resolveTerminology(
    "investmentOffering.label.plural",
    "Oportunidades",
  );
  const dispatch = useAppDispatch();
  const { opportunityId } = route.params;
  const [showSnack, setShowSnack] = useState(false);
  const [msgError, setMsgError] = useState("");
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const refRBSheetSimulation = useRef<any>(null);
  const [page, setPage] = useState(1);
  const { userStatus } = useAppSelector((state) => state.user);
  const { user } = useAuth();

  const { data: opportunity, isLoading: loading } = useQuery({
    queryKey: [getOpportunity.name, opportunityId],
    queryFn: () => getOpportunity(opportunityId),
    enabled: !!opportunityId,
  });

  return (
    <>
      <HeaderDefault
        title={opportunitiesLabel}
        back
        help
        contact
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
        {loading && (
          <View style={{ flex: 1 }}>
            <LoadingComp />
          </View>
        )}

        {!!opportunity ? (
          <>
            {page === 1 && (
              <GeneralInfos setPage={setPage} opportunity={opportunity} />
            )}
            {/* {page === 2 && <FinancialData opportunity={opportunity} />} */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              {userStatus?.status === "Aprovado" && (
                <BtnDefault
                  label="Investir agora"
                  marginBottom={8}
                  onPress={() => {
                    Analytics({ eventName: "DetOportunidade_InvestirAgora" });
                    const res = handleInvest({ user, opportunity });
                    if (res.error && res.msg) {
                      setMsgError(res.msg);
                      setShowSnack(true);
                    } else {
                      nav.navigate("Invest", { opportunity } as never);
                    }
                  }}
                />
              )}
              <BtnDefault
                label="Investir agora"
                onPress={() => {
                  Analytics({
                    eventName: "SimuladorOportunidade_InvestirAgora",
                  });
                  nav.navigate("Invest", { opportunityId: opportunity.id });
                }}
              />
            </View>
            {/* <InvestSimulation
              refRBSheet={refRBSheetSimulation}
              opportunity={opportunity}
            /> */}
          </>
        ) : (
          !loading && <LoadingComp />
        )}

        <Snack visible={showSnack} txt={msgError} setShowSnack={setShowSnack} />
      </SafeAreaView>
    </>
  );
}
