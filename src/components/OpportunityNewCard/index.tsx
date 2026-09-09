import React, { useMemo, useRef, useState } from "react";
import { Alert, View, Text, TouchableOpacity, Image } from "react-native";
import { useCustomStyles } from "./style";
import BtnDefault from "../BtnDefault";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/MyThemeContext";
import { OpportunitiesResponse } from "@/models/opportunities/opportunities.response";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/models/routes/navigation.private";
import CommonMask from "@/helpers/masks";
import { Analytics } from "@/helpers/analytics";
import CaretRightIcon from "@/../assets/newSvgs/icons/keyboard_arrow_right.svg";
import { Divider } from "react-native-paper";
import ModalDefault from "../ModalDefault";
import ApartmentIcon from "@/../assets/newSvgs/icons/apartment.svg";
import { useAppSelector } from "@/redux/hooks";
import { usePlatformFeatureFlag } from "@/features/platform-app/usePlatformFeatureFlag";
import { getInvestmentAccessDecision } from "@/features/investor-access/investorAccess";

type OpportunityCardProps = {
  white?: boolean;
  opportunity: OpportunitiesResponse["data"][0];
};

export default function OpportunityNewCard({
  white,

  opportunity,
}: OpportunityCardProps) {
  const { theme } = useTheme();
  const styles = useCustomStyles();
  const refRBSheetSimulation = useRef<any>(null);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showModal, setShowModal] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const investorProfileRequired = usePlatformFeatureFlag(
    "investor_profile_enabled",
  );

  const openInvestment = () => {
    const access = getInvestmentAccessDecision(user, investorProfileRequired);
    if (!access.allowed) {
      Alert.alert("Investimento indisponível", access.message);
      return;
    }

    nav.navigate("Invest", { opportunityId: opportunity.id });
  };

  const participation =
    typeof opportunity.modality_data.participation === "number"
      ? `${opportunity.modality_data.participation.toFixed(2)}%`
      : opportunity.modality_data.participation;

  const modalityText = useMemo(() => {
    if (showModal)
      switch (opportunity.modality) {
        case "Pagamento Único":
          return "Nessa modalidade o investidor recebe um único pagamento, que é composto pelo juros acumulado do perído mais o principal.";

        case "Pagamentos Mensais":
          return "Nessa modalidade o investidor recebe mensalmente os juros sobre o valor investido e no final do período ele recebe o principal mais juros.";

        default:
          return "Nessa modalidade o investidor recebe parcelas mensais compostas do principal mais juros. É o formato mais comum, utiliza a tabela Price como base";
      }
  }, [showModal]);

  return (
    <TouchableOpacity
      style={white ? styles.cardWhite : styles.card}
      onPress={() => {
        Analytics({ eventName: "HomeApp_OportunidadeSaibaMais" });
        nav.navigate("OpportunitiesDetail", {
          opportunityId: opportunity.id,
          analytics: "HomeApp",
        });
      }}
    >
      <View style={{ flexDirection: "row", gap: 16 }}>
        <View style={styles.container}>
          {opportunity.image ? (
            <Image
              source={{ uri: opportunity.image }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <ApartmentIcon
              width={28}
              height={28}
              style={{ color: theme.customColors.neutrals[600] }}
            />
          )}
        </View>
        <View>
          <Text style={styles.modality}>{opportunity.modality}</Text>
          <Text style={[styles.title]}>{opportunity.name}</Text>
        </View>
      </View>
      <Divider />
      <View style={styles.content}>
        <View>
          <Text style={styles.progressTitle}>
            Captado -{" "}
            {CommonMask.percent(
              (
                opportunity.goal.confirmed_payment_percentage +
                opportunity.goal.percentage_awaiting_payment
              )
                .toFixed(2)
                .toString()
            )}
            %
          </Text>
          <View style={styles.progress}>
            <View
              style={{
                ...styles.progressFill,
                backgroundColor: theme.customColors.secondary[400],
                width: `${
                  opportunity.goal.confirmed_payment_percentage +
                  opportunity.goal.percentage_awaiting_payment
                }%`,
              }}
            />
            <View
              style={{
                ...styles.progressFill,
                width: `${opportunity.goal.confirmed_payment_percentage}%`,
              }}
            />
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <View style={styles.item}>
            <View style={styles.legendTitleContainer}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: theme.customColors.secondary.default },
                ]}
              />
              <Text style={styles.itemTitle}>Ativos</Text>
            </View>
            <Text style={styles.itemValue}>
              {CommonMask.currency(
                opportunity.goal.confirmed_payment_percentage.toFixed(2)
              )}
              %
            </Text>
          </View>
          <View style={styles.item}>
            <View style={styles.legendTitleContainer}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: theme.customColors.secondary[400] },
                ]}
              />
              <Text style={styles.itemTitle}>A receber</Text>
            </View>
            <Text style={styles.itemValue}>
              {CommonMask.currency(
                opportunity.goal.percentage_awaiting_payment.toFixed(2)
              )}
              %
            </Text>
          </View>
          <View style={styles.item}>
            <View style={styles.legendTitleContainer}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: theme.customColors.neutrals[100] },
                ]}
              />
              <Text style={styles.itemTitle}>Restante</Text>
            </View>
            <Text style={styles.itemValue}>
              {CommonMask.currency(
                (
                  100 -
                  opportunity.goal.percentage_awaiting_payment -
                  opportunity.goal.confirmed_payment_percentage
                ).toFixed(2)
              )}
              %
            </Text>
          </View>
        </View>
        <View style={styles.valueContent}>
          <Text style={styles.valueTitle}>Valor da cota:</Text>
          <Text style={styles.value}>
            R${" "}
            {CommonMask.currency(
              (opportunity.monetary.min_investment_value / 100)
                .toFixed(2)
                .toString()
            )}
          </Text>
        </View>
        <Divider />
        <View style={{ gap: 8 }}>
          <View style={styles.item}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>Participação</Text>
            </View>
            <Text style={styles.itemValue}>
              {participation}
            </Text>
          </View>
          <View style={[styles.item]}>
            <Text style={styles.itemTitle}>Investimento mínimo</Text>
            <Text style={styles.itemValue}>
              R${" "}
              {CommonMask.currency(
                (opportunity.monetary.min_investment_value / 100).toFixed(2)
              )}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>Total investido (R$)</Text>

            <Text style={styles.itemValue}>
              R${" "}
              {CommonMask.currency(
                (opportunity.goal.confirmed_payment / 100).toFixed(2)
              )}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>Total investido (%)</Text>
            <Text style={styles.itemValue}>
              {CommonMask.currency(
                opportunity.goal.confirmed_payment_percentage.toFixed(2)
              )}
              %
            </Text>
          </View>
        </View>
      </View>
      <Divider />
      <View style={styles.footer}>
        <BtnDefault
          label="Investir"
          style={styles.buttonLeft}
          onPress={() => {
            Analytics({ eventName: "HomeApp_OportunidadeSimular" });
            openInvestment();
          }}
        />
        <BtnDefault
          white
          label="Mais detalhes"
          icon={
            <CaretRightIcon width={24} heigth={24} color={theme.colors.text} />
          }
          style={styles.buttonRight}
          labelStyle={styles.buttonRightLabel}
          onPress={() => {
            Analytics({ eventName: "HomeApp_OportunidadeSaibaMais" });
            nav.navigate("OpportunitiesDetail", {
              opportunityId: opportunity.id,
              analytics: "HomeApp",
            });
          }}
        />
      </View>

      <ModalDefault
        setVisible={setShowModal}
        visible={showModal}
        title="Modalidade"
        desc={modalityText}
      />
    </TouchableOpacity>
  );
}
