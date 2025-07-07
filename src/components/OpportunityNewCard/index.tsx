import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useCustomStyles } from "./style";
import BtnDefault from "../BtnDefault";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/MyThemeContext";
import { OpportunitiesResponse } from "@/models/opportunities/opportunities.response";
import InvestSimulation from "../InvestSimulation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/models/routes/navigation";
import CommonMask from "@/helpers/masks";
import { Analytics } from "@/helpers/analytics";
import InfoIcon from "@/../assets/newSvgs/icons/info.svg";
import CaretRightIcon from "@/../assets/newSvgs/icons/keyboard_arrow_right.svg";
import { Divider /* , IconButton */ } from "react-native-paper";
import ModalDefault from "../ModalDefault";
import ApartmentIcon from "@/../assets/newSvgs/icons/apartment.svg";
import WarrantiesDescription from "../WarrantiesDescription";

type OpportunityCardProps = {
  // title: string;
  // logo: string | null;
  // risk: string;
  // type: "OPPORTUNITY" | "CASHBACK" | "RENEGOTIATED";
  // returnRate: string;
  // modality: string;
  white?: boolean;
  // hasRepurchase: boolean;
  // hasWarranty: boolean;
  // hasPropertyGuarantee: boolean;
  opportunity: OpportunitiesResponse["data"][0];
  // cashback?: number;
};

export default function OpportunityNewCard({
  // title,
  // logo,
  // risk,
  // type,
  // returnRate,
  // modality,
  white,
  // hasRepurchase,
  // hasWarranty,
  // hasPropertyGuarantee,
  opportunity,
}: // cashback,
OpportunityCardProps) {
  const { theme } = useTheme();
  const styles = useCustomStyles();
  const refRBSheetSimulation = useRef<any>(null);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [timeToPay, setTimeToPay] = useState(0);
  const [showModal, setShowModal] = useState(false);

  /* const returnType = (type: string): string | undefined => {
    switch (type) {
      case "CASHBACK":
        return `Cashback ${
          opportunity.cashback
            ? CommonMask.percent(opportunity.cashback.toFixed(2).toString())
            : "0"
        }%`;
      case "RENEGOTIATED":
        return "Renegociado";
      default:
        return "";
    }
  }; */

  const getTypeColor = (type: string): string => {
    switch (type) {
      // case 'OPPORTUNITY':
      //   return theme.customColors.secondary[400];
      case "CASHBACK":
        return theme.customColors.risk.default;
      case "RENEGOTIATED":
        return theme.customColors.risk[100];
      default:
        return "#CCCCCC";
    }
  };

  /* const getRiskColor = () => {
    const s = opportunity.risk?.charAt(0);

    switch (s) {
      case "A":
        return theme.customColors.success.default;
      case "B":
        return theme.customColors.secondary[700];
      case "C":
        return theme.customColors.warning[300];
      case "D":
        return theme.customColors.error.default;
    }
  }; */

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

  /* useEffect(() => {
    if (opportunity.pagamentoUnico === 1) {
      setTimeToPay(Math.round(opportunity.prazoEmDias / 30));
    } else {
      setTimeToPay(opportunity.prazo);
    }
  }, [opportunity]); */

  return (
    <TouchableOpacity
      style={white ? styles.cardWhite : styles.card}
      onPress={() => {
        Analytics({ eventName: "HomeApp_OportunidadeSaibaMais" });
        nav.navigate("OpportunitiesDetail", {
          opportunity: opportunity,
          analytics: "HomeApp",
        } as never);
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

      {/* <View style={styles.header}>
        <View style={styles.riskContainer}>
          <Text style={[styles.riskValue, { color: getRiskColor() }]}>
            Risco {risk}
          </Text>
        </View>

        <Text
          style={[
            styles.riskValue,
            { color: getTypeColor(type), textTransform: "uppercase" },
          ]}
        >
          {returnType(type)}
        </Text>
      </View> */}
      {/* <WarrantiesDescription
        {...{ hasWarranty, hasRepurchase, hasPropertyGuarantee }}
        warrantyTxt={opportunity.warranty}
        houseTxt={opportunity.propertyGuarantee}
      /> */}
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
              {opportunity.modality_data.participation.toFixed(2)}%
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
          disabled
          style={styles.buttonLeft}
          onPress={() => {
            Analytics({ eventName: "HomeApp_OportunidadeSimular" });
            refRBSheetSimulation.current.open();
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
              opportunity: opportunity,
              analytics: "HomeApp",
            } as never);
          }}
        />
        {/*  <View style={styles.favoriteContainer}>
          <IconButton
            onPress={() => {}}
            icon="star-outline"
            size={24}
            color={theme.customColors.neutrals[500]}
          />
        </View> */}
      </View>
      {/* <InvestSimulation
        refRBSheet={refRBSheetSimulation}
        opportunity={opportunity}
      /> */}
      <ModalDefault
        setVisible={setShowModal}
        visible={showModal}
        title="Modalidade"
        desc={modalityText}
      />
    </TouchableOpacity>
  );
}
