import { Text, View, TouchableOpacity } from "react-native";
import React, { RefObject, useState } from "react";
import { useCustomStyles } from "./style";
import BottomSheet from "../../../../../components/BottomSheet";
import BtnIcon from "../../../../../components/BtnIcon";
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BtnDefault from "../../../../../components/BtnDefault";
import { Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/MyThemeContext";
import CloseIcon from "@/../assets/newSvgs/icons/close_small.svg";
import { useAppSelector } from "@/redux/hooks";
import WarningIcon from "@/../assets/newSvgs/icons/warning-fill.svg";
import InfoIcon from "@/../assets/newSvgs/icons/info-fill.svg";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/models/routes/navigation";
import { Analytics } from "@/helpers/analytics";
import RBSheetRef from "@/helpers/types/rawBottomSheetRef";
import { InvestorProfile } from "@/models/user/me.response";

type Props = {
  refRBSheet: RefObject<RBSheetRef | null>;
  handleContinue(): void;
  investorProfile?: InvestorProfile;
};

export default function InvestorProfileBottom({
  refRBSheet,
  handleContinue,
  investorProfile,
}: Props) {
  const { theme } = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const styles = useCustomStyles();
  const [checked, setChecked] = useState(false);
  const { profileStatus } = useAppSelector((state) => state.investor);
  const [openInvest, setOpenInvest] = useState(false);

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      draggable={false}
      height={340}
      background={
        theme.dark
          ? theme.customColors.neutrals[800]
          : theme.customColors.baseWhite
      }
      onOpen={() => {
        Analytics({
          pageName: investorProfile?.title
            ? "PerfilInvestidorValidarErrado"
            : "PerfilInvestValid",
        });
      }}
      onClose={() => {
        Analytics({
          pageName: investorProfile?.title
            ? "PerfilInvestValidErrado_Fechar"
            : "PerfilInvestValid_Fechar",
        });
        /* if (investorProfile?.title && openInvest) {
          handleContinue();
        } else if (openInvest && checked) {
          handleContinue();
        } */
        setChecked(false);
        setOpenInvest(false);
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headTitle}>Perfil investidor</Text>
          <BtnIcon
            style={styles.btnClose}
            width={28}
            height={28}
            bgColor={theme.customColors.baseWhite}
            onPress={() => refRBSheet?.current?.close()}
          >
            <CloseIcon
              width={16}
              height={16}
              color={theme.customColors.baseBlack}
            />
          </BtnIcon>
        </View>
        <View style={{ flex: 1 }}>
          {profileStatus?.profileInvestor ? (
            <View style={styles.card}>
              <InfoIcon
                color={theme.customColors.hyperlink}
                width={32}
                height={32}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>
                  Esse apetite de risco é diferente do seu informado.
                </Text>
                <Text style={styles.cardTitle}>
                  Seu perfil é:{" "}
                  <Text
                    style={{
                      color: theme.customColors.hyperlink,
                      fontFamily: theme.fonts.extraBold,
                      textTransform: "uppercase",
                    }}
                  >
                    {profileStatus?.profileInvestor}
                  </Text>
                </Text>
                <Text style={{ ...styles.warnTxt, marginTop: 10 }}>
                  Deseja prosseguir assim mesmo?
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <WarningIcon
                color={theme.customColors.warning.default}
                width={32}
                height={32}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>
                  Você não tem seu perfil de investimento definido.
                </Text>
                <Text style={styles.warnTxt}>
                  Deseja prosseguir assim mesmo?
                </Text>
              </View>
            </View>
          )}
          {!profileStatus?.profileInvestor && (
            <TouchableOpacity
              style={styles.checkBlock}
              onPress={() => {
                if (checked) {
                  Analytics({ eventName: "ProsseguirInvestimento_Cancelar" });
                } else {
                  Analytics({ eventName: "ProsseguirInvestimento_Continuar" });
                }
                setChecked(!checked);
              }}
            >
              <Checkbox.Item
                label=""
                status={checked ? "checked" : "unchecked"}
                mode="android"
                onPress={() => setChecked(!checked)}
                color={
                  theme.dark
                    ? theme.customColors.baseWhite
                    : theme.customColors.secondary.default
                }
                uncheckedColor={
                  theme.dark
                    ? theme.customColors.baseWhite
                    : theme.customColors.secondary.default
                }
                rippleColor="transparent"
                style={{ marginLeft: -16, marginRight: -8 }}
              />
              <Text style={styles.checkDesc}>
                Declaro que aceito Prosseguir com investimento, antes de
                conhecer meu perfil de investidor Wealth Money.
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.footer}>
          {!profileStatus?.profileInvestor && (
            <View style={{ flex: 1 }}>
              <BtnDefault
                label="Definir Perfil Investidor"
                white
                onPress={() => {
                  Analytics({
                    eventName: "PerfilInvestValid_DefinirPerfilInvest",
                  });
                  nav.navigate("InvestorProfile");
                }}
              />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <BtnDefault
              label="Prosseguir"
              onPress={() => {
                Analytics({
                  eventName: !profileStatus?.profileInvestor
                    ? "PerfilInvestValid_Continuar"
                    : "PerfilInvestValidErrado_Continuar",
                });
                handleContinue();
                refRBSheet.current?.close();
              }}
              disabled={!profileStatus?.profileInvestor && !checked}
            />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}
