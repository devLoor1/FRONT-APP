import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import PIXIcon from "@/../assets/newSvgs/icons/pix.svg";
import BarChartIcon from "@/../assets/newSvgs/icons/bar_chart.svg";
import QueryStatsIcon from "@/../assets/newSvgs/icons/query_stats.svg";
import OpportunityIcon from "@/../assets/newSvgs/icons/monitoring.svg";
import ReferIcon from "@/../assets/newSvgs/icons/featured_seasonal_and_gifts.svg";
import EyeIcon from "@/../assets/newSvgs/icons/visibility.svg";
import EyeOffIcon from "@/../assets/newSvgs/icons/visibility_off.svg";
import ArrowIcon from "@/../assets/newSvgs/icons/keyboard_arrow_right.svg";
import InfoIcon from "@/../assets/newSvgs/icons/info.svg";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/MyThemeContext";
import { useCommon } from "@/context/CommonContext";
import { useCustomStyles } from "./style";
import BlurValues from "@/components/BlurValues";
import { useAppSelector } from "@/redux/hooks";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/models/routes/navigation.private";
import ModalDefault from "@/components/ModalDefault";
import { Analytics } from "@/helpers/analytics";
import CommonMask from "@/helpers/masks";
import NavIcon from "@/components/NavIcon";
import { WalletResponse } from "@/models-old/investiment/wallet.response";
import { usePlatformTerminology } from "@/features/platform-app/usePlatformTerminology";

type Props = {
  refRBSheet: any;
  resume?: WalletResponse["data"];
};

export default function Navbar({ refRBSheet, resume }: Props) {
  const { resolveTerminology } = usePlatformTerminology();
  const opportunitiesLabel = resolveTerminology(
    "investmentOffering.label.plural",
    "Oportunidades",
  );
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { showBalance, toogleBalance } = useCommon();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { paymentMethodStatus } = useAppSelector((state) => state.user);
  // const { resume } = useAppSelector((state) => state.wallet);
  const [showModal, setShowModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [enablePIX, setEnablePIX] = useState(false);

  useEffect(() => {
    if (paymentMethodStatus) {
      if (paymentMethodStatus.pix.status === "Available") {
        setEnablePIX(true);
      } else {
        setEnablePIX(false);
      }
    }
  }, [paymentMethodStatus]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Minha carteira</Text>
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
      </View>
      <View style={styles.head}>
        <View>
          <View style={styles.row}>
            <Text style={styles.totTitle}>Saldo disponível</Text>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <InfoIcon
                color={theme.customColors.hyperlink}
                width={12}
                height={12}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.row,
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <BlurValues
              value={
                ((resume?.estimated_patrimony || 0) / 100)
                  .toFixed(2)
                  .toString() || "0"
              }
            />
          </View>
        </View>
        {/* <TouchableOpacity
          style={styles.row}
          onPress={() => {
            Analytics({ eventName: "HomeApp_VerExtrato" });
            nav.navigate("Excerpt");
          }}
        >
          <Text style={styles.statement}>Ver Extrato</Text>
          <ArrowIcon
            color={
              theme.dark
                ? theme.customColors.neutrals[500]
                : theme.customColors.neutrals[400]
            }
          />
        </TouchableOpacity> */}
      </View>
      {/* {!!resume?.promotionalBalance && (
        <View style={styles.promoBalanceContainer}>
          <View style={styles.promoBalanaceTitleContainer}>
            <Text style={styles.promoBalanaceTitle}>Saldo promocional</Text>
            <InfoIcon
              color={theme.customColors.hyperlink}
              width={12}
              height={12}
              onPress={() => setShowPromoModal(true)}
            />
          </View>
          <Text style={styles.promoBalanaceValue}>
            R${" "}
            {showBalance
              ? CommonMask.currency(
                  resume.promotionalBalance.toFixed(2).toString() || ""
                )
              : "-"}
          </Text>
        </View>
      )} */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -16 }}
        contentContainerStyle={styles.nav}
      >
        <NavIcon
          onPress={() => {
            Analytics({ eventName: "HomeApp_Pix" });
            // nav.navigate("Pix");
          }}
          disabled={!enablePIX}
          Icon={PIXIcon}
          label={"PIX e\ntransferir"}
        />
        <NavIcon
          onPress={() => {
            Analytics({ eventName: "HomeApp_Results" });
            // nav.navigate("Results");
          }}
          Icon={BarChartIcon}
          label="Resultados"
        />
        <NavIcon
          onPress={() => {
            Analytics({ eventName: "HomeApp_Profitability" });
            // nav.navigate("Profitability");
          }}
          Icon={QueryStatsIcon}
          label={"Variação e\nrentabilidade"}
        />
        <NavIcon
          onPress={() => {
            Analytics({ eventName: "HomeApp_Oportunidade" });
            nav.navigate("InvestTabs" as never);
          }}
          Icon={OpportunityIcon}
          label={opportunitiesLabel}
        />
        <NavIcon
          onPress={() => {
            Analytics({ eventName: "HomeApp_IndiqueAmigo" });
            refRBSheet.current.open();
          }}
          Icon={ReferIcon}
          label="Indique"
        />
      </ScrollView>
      <ModalDefault
        setVisible={setShowModal}
        visible={showModal}
        title="Saldo disponível"
        desc="O valor apresentado representa seu saldo para investimentos na plataforma. Escolha a melhor oportunidade que se adeque ao seu perfil e invista."
      />
      <ModalDefault
        setVisible={setShowPromoModal}
        visible={showPromoModal}
        title="Saldo promocional"
        desc={`Você recebeu R$ ${
          true ? CommonMask.currency(Number(100).toFixed(2).toString()) : "-"
        } para investir em uma nova oportunidade.`}
      />
    </View>
  );
}
