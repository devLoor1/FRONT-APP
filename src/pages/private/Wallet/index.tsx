import { getWalletResume } from "@/services-old/wallet";
import { Analytics } from "@/helpers/analytics";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import HeaderPhoto from "@/components/HeaderPhoto";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useCustomStyles } from "./style";
import { useTheme } from "@/context/MyThemeContext";
import BackToTop from "@/components/BackToTop";
import CardValues from "./components/CardValues";
import InfoIcon from "@/../assets/newSvgs/icons/info.svg";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { getOpportunities } from "@/services/opportunities";
import OpportunityNewCard from "@/components/OpportunityNewCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/models/routes/navigation.private";
import ModalDefault from "@/components/ModalDefault";
import InterestChart from "./components/InterestChart";
import LoadingComp from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePlatformAppAuthenticatedContent } from "@/features/platform-app/usePlatformAppAuthenticatedContent";

export default function WalletPage() {
  const content = usePlatformAppAuthenticatedContent().wallet;
  const { theme } = useTheme();
  const styles = useCustomStyles();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const refPage = useRef<ScrollView>(null);
  const [showToUp, setShowToUp] = useState(false);
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { personalInformationFilled } = useAppSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const insets = useSafeAreaInsets();
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
    Promise.all([refetchResume(), refetchList()]);
  }

  useEffect(() => {
    Analytics({ pageName: "HomeApp" });
  }, []);

  const onRefresh = useCallback(async () => {
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

  return (
    <View style={{ flex: 1 }}>
      <HeaderPhoto analytics="HomeApp" />
      {loadingList || loadingResume ? (
        <LoadingComp transparent />
      ) : (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: insets.bottom + bottomTabBarHeight + 10,
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
              personalInformationFilled && (
                <>
                  <CardValues resume={resume} title={content.investedOpportunitiesTitle} />
                  <InterestChart />
                  <FlatList
                    scrollEnabled={false}
                    data={listOpportunities?.data}
                    contentContainerStyle={{ gap: 8 }}
                    keyExtractor={(item) => String(item.id)}
                    ListHeaderComponent={
                      <View style={[styles.titleContainer, { marginBottom: 0 }]}>
                        <Text style={styles.titleOpportunity}>
                          {content.availableOpportunitiesTitle}
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
                        <Text style={styles.moreTxt}>{content.availableOpportunitiesMoreLabel}</Text>
                      </TouchableOpacity>
                    }
                  />
                </>
              )
            }
          </View>
        </ScrollView>
      )}

      {showToUp && (
        <BackToTop scrollRef={refPage} mb={bottomTabBarHeight / 2} />
      )}
      <ModalDefault
        setVisible={setShowModal}
        visible={showModal}
        title={content.availableOpportunitiesInfoTitle}
        desc={content.availableOpportunitiesInfoDescription}
      />
    </View>
  );
}
