import { getWalletResume } from "@/services-old/wallet";
import { Analytics } from "@/helpers/analytics";
import ProfileIcon from "@/../assets/newSvgs/icons/clinical_notes.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import HeaderPhoto from "@/components/HeaderPhoto";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { GetPaymentMethodAvailable, GetUserStatus } from "@/services/user";
import { useNavigation } from "@react-navigation/native";
import { useCustomStyles } from "./style";
import Navbar from "./components/navbar";
import { useTheme } from "@/context/MyThemeContext";
import BackToTop from "@/components/BackToTop";
import ReferFriend from "@/components/ReferFriend";
import { SafeAreaView } from "react-native-safe-area-context";
import CardValues from "./components/CardValues";
import InfoIcon from "@/../assets/newSvgs/icons/info.svg";
import ReferIcon from "@/../assets/newSvgs/icons/featured_seasonal_and_gifts.svg";
import Banner from "./components/Banner";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { getOpportunities } from "@/services/opportunities";
import OpportunityNewCard from "@/components/OpportunityNewCard";
import CommonMask from "@/helpers/masks";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/models/routes/navigation.private";
import News from "./components/news";
import ModalDefault from "@/components/ModalDefault";
// import PromoComponent from './components/Promo';
import { useCommon } from "@/context/CommonContext";
import EyeIcon from "@/../assets/newSvgs/icons/visibility.svg";
import EyeOffIcon from "@/../assets/newSvgs/icons/visibility_off.svg";
import InterestChart from "./components/InterestChart";
import LoadingComp from "@/components/Loading";
import { useAuth } from "@/context/auth";
import { useQuery } from "@tanstack/react-query";

export default function WalletPage() {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  // const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // const { listOpportunities, loadingList } = useAppSelector(
  //   (state) => state.opportunities
  // );
  const refPage = useRef<ScrollView>(null);
  const [showToUp, setShowToUp] = useState(false);
  const refRBSheet = useRef<any>(null);
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { userStatus } = useAppSelector((state) => state.user);
  const loginData = useAppSelector((state) => state.auth.loginData?.data);
  const [showModal, setShowModal] = useState(false);
  const { showBalance, toogleBalance } = useCommon();
  const { deviceToken } = useAuth();

  const {
    data: resume,
    isLoading: loadingResume,
    isRefetching: isRefetchingResume,
    refetch: refetchResume,
  } = useQuery({
    queryKey: [getWalletResume.name],
    queryFn: getWalletResume,
  });

  const {
    data: listOpportunities,
    isLoading: loadingList,
    isRefetching: isRefetchingList,
    refetch: refetchList,
  } = useQuery({
    queryKey: [getOpportunities.name],
    queryFn: () => getOpportunities({ page: 1, limit: 1 }),
  });

  const refreshing = isRefetchingList || isRefetchingResume;

  function getAll() {
    Promise.all([
      // dispatch(GetUserStatus(deviceToken)),
      // dispatch(getWalletResume()),
      // dispatch(GetInterestReceivedGraph()),
      // dispatch(GetResume()),
      // dispatch(GetDebit()),
      // dispatch(GetDebitWealth()),
      // dispatch(GetPaymentMethodAvailable()),
      // dispatch(GetFAQHightlights({ pageSize: 2 })),
      // dispatch(getOpportunities({ page: 1, limit: 3 })),
      // dispatch(GetCodeRecommendation()),
      refetchResume(),
      refetchList(),
    ]);
  }

  useEffect(() => {
    Analytics({ pageName: "HomeApp" });
    // getAll();
  }, []);

  /* useEffect(() => {
    if (!highlightsList) {
      (async () => {
        await dispatch(GetFAQHightlights({ pageSize: 2 }));
      })();
    }
  }, [highlightsList]); */

  /* useEffect(() => {
    if (summary || listOpportunities) {
      // setRefreshing(false);
    }
  }, [summary, listOpportunities]); */

  const onRefresh = useCallback(async () => {
    // setRefreshing(true);
    getAll();
  }, []);

  function getTopScroll(e: any) {
    const offset = e.nativeEvent.contentOffset.y;
    if (offset > 50) {
      setShowToUp(true);
    } else {
      setShowToUp(false);
    }
  }

  // if (rDailySummary?.hasTransactions) {
  // return <DailySummaryComp />;
  // }

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <HeaderPhoto analytics="HomeApp" />
      {loadingList || loadingResume ? (
        <LoadingComp transparent />
      ) : (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: bottomTabBarHeight,
          }}
          onMomentumScrollEnd={(e) => getTopScroll(e)}
          scrollEventThrottle={16}
          ref={refPage}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
        >
          <View style={styles.container}>
            {
              /* userStatus?.status === "Aprovado" && !userStatus?.waitCaf */ loginData.personal_information_filled ===
              1 ? (
                <>
                  <Navbar refRBSheet={refRBSheet} resume={resume} />
                  {/* <View
                    style={[
                      styles.titleContainer,
                      { justifyContent: "space-between" },
                    ]}
                  >
                    <Text style={styles.titleOpportunity}>Patrimônio</Text>
                    <TouchableOpacity onPress={toogleBalance}>
                      {showBalance ? (
                        <EyeIcon
                          width={18}
                          height={18}
                          color={theme.customColors.neutrals[500]}
                        />
                      ) : (
                        <EyeOffIcon
                          width={18}
                          height={18}
                          color={theme.customColors.neutrals[500]}
                        />
                      )}
                    </TouchableOpacity>
                  </View> */}
                  {/* <CardValues /> */}
                  <InterestChart />
                  {/* <PromoComponent refRBSheet={refRBSheet} /> */}
                </>
              ) : (
                <Banner />
              )
            }

            <FlatList
              scrollEnabled={false}
              data={listOpportunities?.data}
              contentContainerStyle={{ gap: 8 }}
              keyExtractor={(item) => String(item.id)}
              ListHeaderComponent={
                <View style={[styles.titleContainer, { marginBottom: 0 }]}>
                  <Text style={styles.titleOpportunity}>
                    Oportunidades disponíveis
                  </Text>
                  <TouchableOpacity onPress={() => setShowModal(true)}>
                    <InfoIcon
                      color={theme.customColors.hyperlink}
                      width={12}
                      height={12}
                    />
                  </TouchableOpacity>
                </View>
              }
              renderItem={({ item }) => (
                <OpportunityNewCard white opportunity={item} />
              )}
              ListFooterComponent={
                <TouchableOpacity
                  style={{ marginHorizontal: "auto" }}
                  onPress={() => {
                    Analytics({ eventName: "HomeApp_OportunidadeVejaMais" });
                    nav.navigate("Tabs", { screen: "InvestTabs" });
                  }}
                >
                  <Text style={styles.moreTxt}>veja mais</Text>
                </TouchableOpacity>
              }
            />

            {loginData.personal_information_filled === 1 && (
              <View>
                <TouchableOpacity
                  style={styles.btnProfile}
                  onPress={() => {
                    Analytics({ eventName: "HomeApp_PerfilInvestidor" });
                    nav.navigate("InvestorProfile");
                  }}
                >
                  <View style={styles.btnIcon}>
                    <ProfileIcon color={theme.customColors.baseWhite} />
                  </View>
                  <Text style={styles.btnTxt}>Perfil de Investidor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnIndicate}
                  onPress={() => {
                    Analytics({ eventName: "HomeApp_IndiqueAmigo" });
                    refRBSheet.current.open();
                  }}
                >
                  <View style={styles.btnIcon}>
                    <ReferIcon color={theme.customColors.baseWhite} />
                  </View>
                  <Text style={{ ...styles.btnTxt }}>
                    Indique seus amigos e ganhe cashback
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* <News /> */}
          </View>
        </ScrollView>
      )}
      {showToUp && (
        <BackToTop scrollRef={refPage} mb={bottomTabBarHeight / 2} />
      )}
      <ReferFriend refRBSheet={refRBSheet} />
      <ModalDefault
        setVisible={setShowModal}
        visible={showModal}
        title="Novas oportunidades"
        desc="Apresenta o valor total investido, detalhando todos os custos envolvidos."
      />
    </SafeAreaView>
  );
}
