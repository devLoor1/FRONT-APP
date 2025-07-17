/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { captureRef } from 'react-native-view-shot';
// import { shareAsync } from 'expo-sharing';

import BottomSheet from "../BottomSheet";
import BtnIcon from "../BtnIcon";
import { useCustomStyles } from "./style";
import BtnDefault from "../BtnDefault";
import CommonMask from "../../helpers/masks";
import { OpportunitiesResponse } from "@/models/opportunities/opportunities.response";
import { useTheme } from "@/context/MyThemeContext";
import { useAuth } from "@/context/auth";
import CloseIcon from "@/../assets/newSvgs/icons/close_small.svg";
import SubIcon from "@/../assets/newSvgs/icons/do_not_disturb_on.svg";
import AddIcon from "@/../assets/newSvgs/icons/add_circle.svg";
import Snack from "../Snack";
import { useAppSelector } from "@/redux/hooks";
import handleInvest from "@/helpers/handleInvest";
import { RootStackParamList } from "@/models/routes/navigation.private";
import { Analytics } from "@/helpers/analytics";

type Props = {
  refRBSheet: any;
  opportunity: OpportunitiesResponse[0];
};

export default function InvestSimulation({ refRBSheet, opportunity }: Props) {
  const { theme } = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const styles = useCustomStyles();
  const simulationViewRef = useRef<ScrollView>(null);
  const { userStatus } = useAppSelector((state) => state.user);
  const [quotas, setQuotas] = useState("1");
  const { user } = useAuth();
  const { resume } = useAppSelector((state) => state.wallet);
  const [tot, setTot] = useState(0);
  const [showSnack, setShowSnack] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [addDisabled, setAddDisabled] = useState(false);
  const [subtractDisabled, setSubtractDisabled] = useState(false);
  const [timeToPay, setTimeToPay] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);

  function sum() {
    Analytics({ eventName: "SimuladorOportunidade_MaisCota" });
    setQuotas((+quotas + 1).toString());
  }

  function sub() {
    if (+quotas > 1) {
      Analytics({ eventName: "SimuladorOportunidade_MenosCota" });
      setQuotas((+quotas - 1).toString());
    }
  }

  async function captureView() {
    /* try {
      setIsCapturing(true);
      const uri = await captureRef(simulationViewRef, {
        format: 'png',
        quality: 0.9,
        snapshotContentContainer: true,
      });
      setIsCapturing(false);
      return uri;
    } catch (error) {
      setIsCapturing(false);
      console.error('Failed to capture view:', error);
    } */
  }

  async function shareSimulation() {
    // const uri = await captureView();
    // if (uri) await shareAsync(uri, { dialogTitle: 'Simulação de investimento' });
  }

  useEffect(() => {
    Analytics({ pageName: "SimuladorOportunidade" });
  }, []);

  useEffect(() => {
    setTot(opportunity.valorCota * +quotas);
    if (+quotas <= 0) {
      setQuotas("1");
      setSubtractDisabled(false);
      setAddDisabled(true);
    }

    if (+quotas > 1) {
      setSubtractDisabled(false);
      setAddDisabled(false);
    }

    if (+quotas === opportunity.qtdCotasDisponiveis) {
      setAddDisabled(true);
    }

    if (+quotas > opportunity.qtdCotasDisponiveis) {
      setQuotas(opportunity.qtdCotasDisponiveis.toString());
      setAddDisabled(true);
    }
  }, [quotas]);

  useEffect(() => {
    if (opportunity.pagamentoUnico === 1) {
      setTimeToPay(Math.round(opportunity.prazoEmDias / 30));
    } else {
      setTimeToPay(opportunity.prazo);
    }
  }, [opportunity]);

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      height={700}
      draggable={false}
      background={theme.dark ? theme.customColors.neutrals[800] : "#fff"}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headTitle}>Simular seu investimento</Text>
          <BtnIcon
            style={styles.btnClose}
            width={28}
            height={28}
            bgColor={theme.customColors.baseWhite}
            onPress={() => {
              Analytics({ eventName: "SimuladorOportunidade_Fechar" });
              refRBSheet.current.close();
            }}
          >
            <CloseIcon
              color={theme.customColors.baseBlack}
              width={16}
              height={16}
            />
          </BtnIcon>
        </View>
        <ScrollView
          ref={simulationViewRef}
          nestedScrollEnabled
          style={{ flex: 1 }}
          contentContainerStyle={styles.simulationContainer}
        >
          <Text style={styles.title}>{opportunity.name}</Text>
          <View style={styles.codesRow}>
            <View
              style={[
                styles.code,
                {
                  backgroundColor:
                    "#" + opportunity.ratingCor ||
                    theme.customColors.secondary.default,
                },
              ]}
            >
              <Text style={styles.codeTxt}>{opportunity.codeOpportunity}</Text>
            </View>
            {opportunity.hasCashback && opportunity.cashback > 0 ? (
              <View
                style={[
                  styles.code,
                  { backgroundColor: theme.customColors.warning.default },
                ]}
              >
                <Text
                  style={[
                    styles.codeTxt,
                    { color: theme.customColors.baseBlack },
                  ]}
                >
                  Cashback{" "}
                  {CommonMask.percent(
                    (opportunity.cashback || 0).toFixed(2).toString()
                  )}
                  %
                </Text>
              </View>
            ) : (
              <></>
            )}
          </View>
          <View style={styles.paramsRow}>
            <View style={styles.paramsItem}>
              <Text style={styles.paramBigTitle}>Cotas desejadas</Text>
              <View style={styles.quotas}>
                <TouchableOpacity
                  onPress={sub}
                  disabled={subtractDisabled}
                  style={{ opacity: +quotas < 2 ? 0.4 : 1 }}
                >
                  <SubIcon
                    color={theme.customColors.hyperlink}
                    width={32}
                    height={32}
                  />
                </TouchableOpacity>
                <View style={{ width: 41 }}>
                  <TextInput
                    value={quotas}
                    onChangeText={(txt) => {
                      const onlyNumbers = txt.replace(/[^0-9]/g, "");

                      const value = Math.max(1, parseInt(onlyNumbers || "1"));
                      setQuotas(value.toString());
                    }}
                    style={styles.input}
                    keyboardType="number-pad"
                  />
                </View>
                <TouchableOpacity
                  onPress={sum}
                  disabled={addDisabled}
                  style={{ opacity: addDisabled ? 0.4 : 1 }}
                >
                  <AddIcon
                    color={theme.customColors.hyperlink}
                    width={32}
                    height={32}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ ...styles.paramsRow, marginBottom: 8 }}>
            <View style={styles.paramValueBlock}>
              <Text style={styles.paramValueTitle}>Valor Investido</Text>
              <Text style={styles.paramValueTxt}>
                R$ {CommonMask.currency(tot.toFixed(2).toString())}
              </Text>
            </View>
            <View style={styles.paramValueBlock}>
              <Text style={styles.paramValueTitle}>Lucro Bruto Esperado</Text>
              <Text style={styles.paramValueTxt}>
                R${" "}
                {CommonMask.currency(
                  (
                    opportunity.valorCotaRentabilizada * +quotas -
                    opportunity.valorCota * +quotas
                  )
                    .toFixed(2)
                    .toString()
                )}
              </Text>
            </View>
          </View>
          <View style={styles.paramsRow}>
            <View style={styles.paramTaxBlock}>
              <Text style={styles.paramTaxTitle}>Taxa de retorno</Text>
              <Text style={styles.paramTexTxt}>
                {CommonMask.percent(
                  opportunity.taxaReceberAm.toFixed(2).toString()
                )}{" "}
                % a.m
              </Text>
            </View>
            <View style={styles.paramTaxBlock}>
              <Text style={styles.paramTaxTitle}>
                {opportunity.paymentType === "pagamento_unico"
                  ? "Prazo"
                  : "Parcelas"}
              </Text>
              <Text style={styles.paramTexTxt}>
                {timeToPay} {timeToPay === 1 ? "mês" : "meses"}
              </Text>
            </View>
          </View>
          <View style={styles.list}>
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>Valor da cota</Text>
              <Text style={styles.listItemDesc}>
                R${" "}
                {CommonMask.currency(
                  opportunity.valorCota.toFixed(2).toString()
                )}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>Quantidade de cotas</Text>
              <Text style={styles.listItemDesc}>{quotas}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>Total à pagar</Text>
              <Text style={styles.listItemDesc}>
                R$ {CommonMask.currency(tot.toFixed(2).toString())}
              </Text>
            </View>
            {!isCapturing && (
              <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>Saldo disponível</Text>
                <Text style={styles.listItemDesc}>
                  R${" "}
                  {CommonMask.currency(
                    resume?.availableBalance?.toFixed(2).toString() || "0"
                  )}
                </Text>
              </View>
            )}
            {!isCapturing &&
              (resume?.availableBalance || 0) >= opportunity.valorCota && (
                <View style={styles.listItem}>
                  <Text style={styles.listItemTitle}>
                    Saldo após investimento
                  </Text>
                  <Text style={styles.listItemDesc}>
                    R${" "}
                    {CommonMask.currency(
                      ((resume?.availableBalance || 0) - tot)
                        .toFixed(2)
                        .toString()
                    )}
                  </Text>
                </View>
              )}
          </View>
        </ScrollView>
        <View style={{ paddingHorizontal: 16, gap: 8 }}>
          {userStatus?.status === "Aprovado" && (
            <BtnDefault
              label="Investir agora"
              onPress={() => {
                Analytics({ eventName: "SimuladorOportunidade_InvestirAgora" });
                if (resume?.availableBalance === undefined) {
                  refRBSheet.current.close();
                  nav.navigate("Deposit", { origin: "investment" });
                } else {
                  const res = handleInvest({
                    user: user,
                    opportunity: opportunity,
                  });
                  if (res.error && res.msg) {
                    setMsgError(res.msg);
                    setShowSnack(true);
                  } else {
                    refRBSheet.current.close();
                    nav.navigate("Invest", {
                      opportunity: opportunity,
                      quotasRoute: quotas,
                    } as never);
                  }
                }
              }}
            />
          )}
          <BtnDefault
            label="Compartilhar simulação"
            white
            onPress={shareSimulation}
          />
        </View>
      </View>
      <Snack
        type="information"
        visible={showSnack}
        txt={msgError}
        setShowSnack={setShowSnack}
      />
    </BottomSheet>
  );
}
