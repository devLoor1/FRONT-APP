import { memo, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SceneRendererProps } from "react-native-tab-view";
import QrCode from "react-qr-code";
import * as Clipboard from "expo-clipboard";

import LoadingComp from "@/components/Loading";
import { InvestmentRequest } from "@/models/investments/investment.request";
import { getInvestmentQrCode, postInvestments } from "@/services/investments";
import { useMutation, useQuery } from "@tanstack/react-query";
import useCustomStyles from "./style";
import BtnDefault from "@/components/BtnDefault";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/models/routes/navigation.private";
import { Divider } from "react-native-paper";
import CommonMask from "@/helpers/masks";
import moment from "moment";
import { InvestmentStatus } from "@/models/investments/investment.response";
import Snack from "@/components/Snack";

type FinishTabProps = {
  data: InvestmentRequest;
  currentTab: boolean;
} & SceneRendererProps;

const FinishTab: React.FC<FinishTabProps> = ({ data, currentTab }) => {
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
  const { data: investmentInfo, isLoading } = useQuery({
    queryKey: [getInvestmentQrCode.name, investmentResult],
    queryFn: () => getInvestmentQrCode(investmentResult?.id || -1),
    enabled: !!investmentResult,
  });

  useEffect(() => {
    if (!hasMutated.current && !!data && currentTab) {
      invest(data);
      hasMutated.current = false;
    }

    return () => {
      hasMutated.current = false;
    };
  }, [currentTab, data, invest]);

  useEffect(() => {
    if (isError) setShowSnack(true);
  }, [isError]);

  console.log(JSON.stringify(error?.response?.data, null, 2));

  if (isLoading || isPending) return <LoadingComp />;

  return (
    <View style={styles.container}>
      {isError ? (
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
                {CommonMask.currency(
                  ((investmentInfo?.value || 0) / 100).toString()
                )}
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
              <Text style={styles.rowTitle}>Oportunidade</Text>
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
