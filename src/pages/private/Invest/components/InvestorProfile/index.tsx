import { Text, View } from "react-native";
import React, { RefObject, useState } from "react";
import { useCustomStyles } from "./style";
import BottomSheet from "../../../../../components/BottomSheet";
import BtnIcon from "../../../../../components/BtnIcon";
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BtnDefault from "../../../../../components/BtnDefault";
import { useTheme } from "@/context/MyThemeContext";
import CloseIcon from "@/../assets/newSvgs/icons/close_small.svg";
import WarningIcon from "@/../assets/newSvgs/icons/warning-fill.svg";
import InfoIcon from "@/../assets/newSvgs/icons/info-fill.svg";
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
  const styles = useCustomStyles();
  // const { profileStatus } = useAppSelector((state) => state.investor);
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
          {investorProfile?.title ? (
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
                    {investorProfile?.title}
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
                  Quando essa etapa for exigida pela plataforma, conclua o perfil antes de investir.
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <BtnDefault
              label="Prosseguir"
              onPress={() => {
                Analytics({
                  eventName: !investorProfile?.title
                    ? "PerfilInvestValid_Continuar"
                    : "PerfilInvestValidErrado_Continuar",
                });
                handleContinue();
                refRBSheet.current?.close();
              }}
              disabled={!investorProfile?.title}
            />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}
