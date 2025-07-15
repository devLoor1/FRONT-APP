import BtnDefault from "@/components/BtnDefault";
import CommonMask from "@/helpers/masks";
import { useAppSelector } from "@/redux/hooks";
import RBSheetRef from "@/helpers/types/rawBottomSheetRef";
import { useTheme } from "@/context/MyThemeContext";
import { Analytics } from "@/helpers/analytics";
import { OpportunityDetails } from "@/models/opportunities/opportunityDetails.response";
import { Me } from "@/models/user/me.response";
import SubIcon from "@/../assets/newSvgs/icons/do_not_disturb_on.svg";
import AddIcon from "@/../assets/newSvgs/icons/add_circle.svg";
import { useCustomStyles } from "../../style";

import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import InvestorProfileBottom from "../../components/InvestorProfile";
import { SceneRendererProps } from "react-native-tab-view";
import { getOpportunity } from "@/services/opportunities";
import { getMe } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";

const InvestmentTab: React.FC<
  {
    opportunityId: number;
    onNext: (props: { quotas: number; anonymous: boolean }) => void;
  } & SceneRendererProps
> = ({ opportunityId, onNext, jumpTo }) => {
  const styles = useCustomStyles();
  const refRBSheetInvestorProfile = useRef<RBSheetRef>(null);
  const { theme } = useTheme();
  const [quotas, setQuotas] = useState(1);
  const [page, setPage] = useState(1);
  const [tot, setTot] = useState(0);
  const [addDisabled, setAddDisabled] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [subtractDisabled, setSubtractDisabled] = useState(false);
  // const maxQuota = opportunity.qtdTotalCotas / 2;
  const loginData = useAppSelector((state) => state.auth.loginData.data);
  const refRBSheet = useRef<RBSheetRef>(null);
  const [showSnack, setShowSnack] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [finishedAnimation, setFinishedAnimation] = useState(false);
  const [timeToPay, setTimeToPay] = useState(0);

  const { data: opportunity, isLoading: loading } = useQuery({
    queryKey: [getOpportunity.name, opportunityId],
    queryFn: () => getOpportunity(opportunityId),
    enabled: !!opportunityId,
  });

  const { data: me, isLoading: loadingMe } = useQuery({
    queryKey: [getMe.name],
    queryFn: getMe,
  });

  useEffect(() => {
    Analytics({ pageName: "OportInvestirAgora" });

    /*  return () => {
      dispatch(reset());
      setPage(1);
      setFinishedAnimation(false);
    }; */
  }, []);

  function sum() {
    Analytics({ eventName: "OportInvestirAgora_MaisCota" });
    setQuotas(quotas + 1);
  }

  function sub() {
    if (+quotas > 1) {
      Analytics({ eventName: "OportInvestirAgora_MenosCota" });
      setQuotas(quotas - 1);
    }
  }

  function handleOnNext() {
    onNext({ quotas, anonymous });
    jumpTo("personal_data");
  }

  useEffect(() => {
    if (opportunity) {
      if (+quotas <= 0) {
        setQuotas(1);
        setSubtractDisabled(false);
        setAddDisabled(true);
        return;
      }

      if (+quotas > 1) {
        setSubtractDisabled(false);
        setAddDisabled(false);
      } else {
        setSubtractDisabled(true);
      }

      /* if (
        +quotas > 1 &&
        user.balanceTot - +quotas * opportunity.monetary.min_investment_value/ 100 <
          opportunity.monetary.min_investment_value/ 100
      ) {
        setAddDisabled(true);
      }

      if (
        user.balanceTot <
        +quotas * opportunity.monetary.min_investment_value/ 100
      ) {
        if (+quotas > 1) {
          setMsgError(`Saldo insuficiente!`);
          setShowSnack(true);
          const newValue = Math.floor(
            user.balanceTot / opportunity.monetary.min_investment_value/ 100
          );
          if (newValue >= 1) {
            setQuotas(newValue.toString());
          } else {
            setQuotas("1");
          }
        }
        setAddDisabled(true);
        return;
      } */

      if (+quotas >= (opportunity?.goal.remaining_quota || 0)) {
        setMsgError(`Você atingiu o limite de cotas disponíveis!`);
        setShowSnack(true);
        return;
      }

      /* if (+quotas >= maxQuotaToInvest) {
        setMsgError(
          `Você atingiu o limite de ${maxQuotaToInvest} cota${
            maxQuotaToInvest > 1 ? "s" : ""
          }!`
        );
        setShowSnack(true);
        return;
      } */

      setTot((opportunity.monetary.min_investment_value / 100) * +quotas);
    }
  }, [quotas]);
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.head}>
          <Text style={styles.title}>{opportunity?.name}</Text>
        </View>

        <View
          style={[
            styles.head,
            {
              borderBottomWidth: 0,
            },
          ]}
        >
          <Text style={styles.title}>Valor de investimento</Text>
          <Text style={styles.description}>
            Insira o valor que deseja investir nesta operação!
          </Text>
        </View>

        <View>
          <Text style={styles.quotasTitle}>Cotas desejadas</Text>
          <View style={styles.quotas}>
            <TouchableOpacity
              onPress={sub}
              disabled={subtractDisabled}
              style={{
                opacity: +quotas < 2 ? 0.4 : 1,
              }}
            >
              <SubIcon
                color={theme.customColors.hyperlink}
                width={32}
                height={32}
              />
            </TouchableOpacity>
            <View
              style={{
                width: 60,
              }}
            >
              <TextInput
                value={quotas.toString()}
                onChangeText={(txt) => {
                  const onlyNumbers = txt.replace(/[^0-9]/g, "");
                  const value = Math.max(1, parseInt(onlyNumbers || "1"));
                  setQuotas(value);
                }}
                style={styles.input}
                keyboardType="number-pad"
              />
            </View>
            <TouchableOpacity
              onPress={sum}
              disabled={addDisabled}
              style={{
                opacity: addDisabled ? 0.4 : 1,
              }}
            >
              <AddIcon
                color={theme.customColors.hyperlink}
                width={32}
                height={32}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quotaContainer}>
          <Text style={styles.quotaTitle}>Valor da cota</Text>
          <Text style={styles.quotaValue}>
            R${" "}
            {CommonMask.currency(
              ((opportunity?.monetary.min_investment_value || 0) / 100)
                .toFixed(2)
                .toString()
            )}
          </Text>
        </View>

        <View style={styles.anonymousContainer}>
          <Checkbox.Item
            mode="android"
            rippleColor="transparent"
            onPress={() => setAnonymous(!anonymous)}
            status={anonymous ? "checked" : "unchecked"}
            label="Investir de forma anônima"
            style={styles.checkbox}
            labelStyle={{
              fontFamily: theme.fonts.semiBold,
            }}
          />
        </View>

        <View style={styles.list}>
          {/* <View style={styles.listItem}>
         <Text style={styles.listItemTitle}>Valor da cota</Text>
         <Text style={styles.listItemDesc}>
           R${" "}
           {CommonMask.currency(
             ((opportunity?.monetary.min_investment_value || 0) / 100)
               .toFixed(2)
               .toString()
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
        <View style={styles.listItem}>
         <Text style={styles.listItemTitle}>Saldo disponível</Text>
         <Text style={styles.listItemDesc}>
           R${" "}
           {CommonMask.currency(
             user?.balanceTot?.toFixed(2).toString() || "0"
           )}
         </Text>
        </View>
        <View style={styles.listItem}>
         <Text style={styles.listItemTitle}>Saldo após investimento</Text>
         <Text style={styles.listItemDesc}>
           R${" "}
           {CommonMask.currency(
             ((user?.balanceTot || 0) - tot).toFixed(2).toString()
           )}
         </Text>
        </View> */}
          {/* <View style={styles.listItem}>
         <Text
           style={{
             ...styles.listItemTitle,
             color: theme.customColors.neutrals[400],
           }}>
           Cashback esperado
         </Text>
         <Text
           style={{
             ...styles.listItemDesc,
             color: theme.customColors.neutrals[400],
           }}>
           R$ 6,00
         </Text>
        </View> */}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {!!loginData?.personal_information_filled && (
          <BtnDefault
            label="Salvar e avançar"
            onPress={() => {
              if (
                me?.investor_profile.title !==
                opportunity?.investor_profile.title
              ) {
                refRBSheetInvestorProfile.current?.open();
              } else {
                Analytics({
                  eventName: "OportInvestirAgora_ConfirmaInvestimento",
                  /* exclusiveData: {
            firebase: {
              cod_oportunidade: opportunity.codeOpportunity,
              risco_oportunidade: opportunity.rating,
              valor_cota: opportunity.valorCota,
              quantidade_cotas: +quotas,
            },
            appsFlyer: {
              cod_oportunidade: opportunity.codeOpportunity,
              risco_oportunidade: opportunity.rating,
              valor_cota: opportunity.valorCota,
              quantidade_cotas: +quotas,
            },
          }, */
                });
                handleOnNext();
              }
            }}
          />
        )}
      </View>
      <InvestorProfileBottom
        investorProfile={me?.investor_profile}
        refRBSheet={refRBSheetInvestorProfile}
        handleContinue={handleOnNext}
      />
    </>
  );
};

export default InvestmentTab;
