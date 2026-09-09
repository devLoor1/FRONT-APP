import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SceneRendererProps } from "react-native-tab-view";
import QrCode from "react-qr-code";
import * as Clipboard from "expo-clipboard";

import LoadingComp from "@/components/Loading";
import { InvestmentRequest } from "@/models/investments/investment.request";
import { getInvestmentQrCode, postInvestments } from "@/services/investments";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import useCustomStyles from "./style";
import BtnDefault from "@/components/BtnDefault";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/models/routes/navigation.private";
import { Divider } from "react-native-paper";
import CommonMask from "@/helpers/masks";
import moment from "moment";
import { InvestmentStatus } from "@/models/investments/investment.response";
import Snack from "@/components/Snack";
import { usePlatformTerminology } from "@/features/platform-app/usePlatformTerminology";

type FinishTabProps = {
  data: InvestmentRequest;
  currentTab: boolean;
} & SceneRendererProps;

const FinishTab: React.FC<FinishTabProps> = ({ data, currentTab }) => {
  const { resolveTerminology } = usePlatformTerminology();
  const opportunityLabel = resolveTerminology(
    "investmentOffering.label.singular",
    "Oportunidade",
  );
  const [showSnack, setShowSnack] = useState(false);
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = useCustomStyles();
  const hasMutated = useRef(false);
  const {
    mutateAsync: invest,
    data: investmentResult,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: [postInvestments.name],
    mutationFn: postInvestments,
  });

  const {
    data: investmentInfo,
    isLoading,
    isError: isQrError,
    error: qrError,
  } = useQuery({
    queryKey: [getInvestmentQrCode.name, investmentResult?.qr_code.id],
    queryFn: investmentResult?.qr_code.id
      ? () => getInvestmentQrCode(investmentResult?.qr_code.id)
      : skipToken,
  });

  useEffect(() => {
    if (!hasMutated.current && !!data && currentTab) {
      hasMutated.current = true;
      invest(data);
    }
  }, [currentTab, data]);

  useEffect(() => {
    if (isError) setShowSnack(true);
  }, [isError]);

  if (isLoading || isPending) return <LoadingComp />;

  return (
    <View style={styles.container}>
      {isError || isQrError ? (
        <View style={styles.error}>
          <Text style={styles.congrats}>Ops! Algo deu errado...</Text>
          <Text style={styles.title}>Tente novamente mais tarde.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <Text style={styles.title}>
            Utilize o QR Code do Pix abaixo para concluir o investimento.
          </Text>
          <View style={styles.qrContainer}>
            <QrCode
              value={investmentInfo?.code || ""}
              height={204}
              accentHeight={206}
            />
          </View>
          <BtnDefault
            label="Pix copia e cola"
            onPress={() => Clipboard.setStringAsync(investmentInfo?.code || "")}
          />
          <View>
            <View style={styles.row}>
              <Text style={styles.rowTitle}>Valor</Text>
              <Text style={styles.rowValue}>
                R${" "}
                {CommonMask.currency((investmentInfo?.value || 0).toString())}
              </Text>
            </View>
            <Divider />
            <View style={styles.row}>
              <Text style={styles.rowTitle}>Criado em</Text>
              <Text style={styles.rowValue}>
                {moment(investmentInfo?.created_at).format("DD/MM/YYYY")}
              </Text>
            </View>
            <Divider />
            <View style={styles.row}>
              <Text style={styles.rowTitle}>{opportunityLabel}</Text>
              <Text style={styles.rowValue}>
                {investmentInfo?.investment.opportunity.name}
              </Text>
            </View>
            <Divider />
            <View style={styles.row}>
              <Text style={styles.rowTitle}>Status</Text>
              <Text style={styles.rowValue}>
                {InvestmentStatus[investmentInfo?.status || "waiting_payment"]}
              </Text>
            </View>
            <Divider />
            <View style={styles.row}>
              <Text style={styles.rowTitle}>Expira em</Text>
              <Text style={styles.rowValue}>
                {moment(investmentInfo?.expires_at).format("DD/MM/YYYY")}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
      <View style={styles.footer}>
        <BtnDefault
          white
          label="Voltar para meus investimentos"
          onPress={() => navigate("Tabs", { screen: "InvestmentTabs" })}
        />
      </View>
      <Snack
        visible={showSnack}
        setShowSnack={setShowSnack}
        txt={
          error
            ? "message" in error?.response?.data!
              ? error?.response?.data.message || ""
              : error?.response?.data.errors
                  ?.map((err) => err.message)
                  .join("\n") || ""
            : ""
        }
      />
    </View>
  );
};

export default memo(FinishTab);
