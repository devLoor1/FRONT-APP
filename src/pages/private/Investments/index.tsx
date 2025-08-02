import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useAppDispatch } from "@/redux/hooks";
import BackToTop from "@/components/BackToTop";
import { Analytics } from "@/helpers/analytics";
import { useAuth } from "@/context/auth";
import { useTheme } from "@/context/MyThemeContext";
import { useCustomStyles } from "./style";
import HeaderPhoto from "@/components/HeaderPhoto";
import Card from "./components/Card";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Chip, TextInput } from "react-native-paper";
import SearchIcon from "@/../assets/newSvgs/icons/search.svg";
import { debounce } from "lodash";
import { OpportunitiesRequest } from "@/models/opportunities/opportunities.request";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getSegments } from "@/services/common";
import { getInvestments } from "@/services/investments";
import { InvestmentsResponse } from "@/models/investments/investments.response";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InvestmentPage() {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const bottomTabBarHeight = useBottomTabBarHeight();
  // const { listOpportunities, loadingList, requestError, moreOpportunities } =
  //   useAppSelector((state) => state.opportunities);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 3;
  const opportunityInvested = undefined;
  const [codeOpportunity, setCodeOpportunity] = useState("");
  const [data, setData] = useState<InvestmentsResponse["data"]>([]);
  const [showToUp, setShowToUp] = useState(false);
  // const [refreshing, setRefreshing] = React.useState(false);
  const { deviceToken } = useAuth();
  const refPage = useRef<FlatList>(null);

  const [filter, setFilter] = useState<any>({});
  const [segmentsFilter, setSegmentsFilter] = useState<number[]>([]);
  const [shortOrder, setShortOrder] = useState("");
  const [searchQuery, setSearchQuery] =
    useState<OpportunitiesRequest["searchQuery"]>("");
  const insets = useSafeAreaInsets();

  const filterSheetRef = useRef<any>(null);

  const {
    data: segments,
    isLoading: loadingSegments,
    isRefetching: isRefetchingSegments,
    refetch: refetchSegments,
  } = useQuery({ queryKey: [getSegments.name], queryFn: getSegments });

  const {
    data: listOpportunities,
    isLoading: loadingList,
    isFetching: isRefetchingList,
    refetch: refetchList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [getInvestments.name + "Infinite", segmentsFilter, searchQuery],
    initialPageParam: 1,
    queryFn: ({ pageParam: page = 1 }) =>
      getInvestments({
        page,
        limit: 10,
        segments: segmentsFilter,
        name: searchQuery,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page < lastPage.meta.last_page)
        return lastPage.meta.current_page + 1;

      return undefined;
    },
  });

  const refreshing =
    (!loadingSegments && isRefetchingSegments) ||
    (!loadingList && isRefetchingList);

  const handleFilter = (filter: any) => {
    setFilter(filter);
    setData([]);
    setPageNumber(1);
    if (filterSheetRef.current) {
      filterSheetRef.current.close();
    }
  };

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const filterFields = {
    title: "Filtrar",
    height: 600,
    fields: [
      {
        title: "Modalidade",
        key: "PaymentTypes",
        multiple: true,
        fields: [
          { label: "Pagamentos Mensais", value: "MonthlyPayments" },
          { label: "Juros Mensais", value: "MonthlyInterest" },
          { label: "Pagamento Único", value: "SinglePayment" },
        ],
      },
      {
        title: "Garantia",
        key: "WarrantyTypes",
        multiple: true,
        fields: [
          { label: "Recompra Garantida", value: "HasRepurchase" },
          { label: "Garantia de Imóvel", value: "HasPropertyGuarantee" },
          { label: "Garantia de Recebimento", value: "HasReceivableWarranty" },
          { label: "Liquidez Antecipada", value: "HasEarlyLiquidity" },
        ],
      },
      {
        title: "Risco",
        key: "CreditRisk",
        multiple: true,
        fields: [
          { label: "Risco AA+", value: "risco_super_baixo" },
          { label: "Risco B", value: "risco_baixo" },
          { label: "Risco B-", value: "risco_medio" },
          { label: "Risco C", value: "risco_alto" },
          { label: "Risco D", value: "risco_super_alto" },
        ],
      },
    ],
    buttons: {
      clear: "Limpar filtros",
      apply: "Aplicar",
    },
    onApply: handleFilter,
  };

  useEffect(() => {
    Analytics({ pageName: "OportEntr" });
  }, []);

  /* useEffect(() => {
    const applyFilters = async () => {
      setData([]);
      setPageNumber(1);
    };
    applyFilters();
  }, [shortOrder, opportunityInvested, filter]); */

  useEffect(() => {
    setData(listOpportunities?.pages.flatMap((page) => page.data) ?? []);
  }, [listOpportunities]);

  function getTopScroll(e: any) {
    const offset = e.nativeEvent.contentOffset.y;
    if (offset > 350) {
      setShowToUp(true);
    } else {
      setShowToUp(false);
    }
  }

  function onEndReached() {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  function selectSegment(segmentId: number) {
    setSegmentsFilter((pv) => {
      if (pv.includes(segmentId)) return pv.filter((id) => id !== segmentId);

      return [...pv, segmentId];
    });
  }

  const onRefresh = React.useCallback(async () => {
    setData([]);
    refetchSegments();
    if (pageNumber === 1) refetchList();
    else setPageNumber(1);
  }, [pageNumber, refetchList]);

  return (
    <View style={{ flex: 1 }}>
      <HeaderPhoto analytics="OportEntr" />

      <FlatList<(typeof data)[0]>
        data={data}
        renderItem={({ item }) => <Card white investment={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        keyExtractor={(item, index) => `${item.opportunity_id}-${index}`}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + bottomTabBarHeight + 10,
          paddingHorizontal: 16,
          gap: 16,
        }}
        onEndReached={onEndReached}
        onScroll={getTopScroll}
        onEndReachedThreshold={0.1}
        ListHeaderComponentStyle={{ paddingTop: 24 }}
        ref={refPage}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Carteira</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -16 }}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            >
              {segments?.map((segment) => (
                <Chip
                  key={segment.id}
                  mode="outlined"
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: "#FFFFFF",
                  }}
                  textStyle={{ fontFamily: theme.fonts.regular }}
                  selected={segmentsFilter.includes(segment.id)}
                  onPress={selectSegment.bind(null, segment.id)}
                >
                  {segment.name}
                </Chip>
              ))}
            </ScrollView>
            <View style={styles.actionsContainer}>
              <TextInput
                onChangeText={debounce(onChangeSearch, 1000)}
                style={styles.searchInput}
                placeholder="Pesquisar"
                mode="flat"
                placeholderTextColor={theme.colors.text}
                activeOutlineColor={theme.colors.text}
                outlineColor={theme.customColors.neutrals[100]}
                underlineColor="transparent"
                selectionColor={theme.colors.text}
                activeUnderlineColor="transparent"
                theme={{
                  roundness: 12,
                  dark: theme.dark,
                  colors: { text: theme.colors.text },
                  fonts: { regular: { fontFamily: theme.fonts.semiBold } },
                }}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <SearchIcon
                        color={theme.colors.text}
                        width={24}
                        height={24}
                      />
                    )}
                  />
                }
              />
            </View>
          </>
        }
        ListFooterComponent={
          loadingList || isFetchingNextPage ? (
            <ActivityIndicator
              size="large"
              color={theme.customColors.secondary.default}
            />
          ) : null
        }
        ListEmptyComponent={
          !loadingList && !isRefetchingList && data.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nenhum investimento encontrado
              </Text>
            </View>
          ) : null
        }
      />

      {showToUp && <BackToTop listRef={refPage} mb={bottomTabBarHeight / 2} />}
    </View>
  );
}
