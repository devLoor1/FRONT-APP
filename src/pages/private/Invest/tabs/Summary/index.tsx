import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Controller, useForm } from "react-hook-form";
import { Checkbox, List } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { SceneRendererProps } from "react-native-tab-view";
import moment from "moment";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";

import Input from "@/components/Input";
import Select from "@/components/Select";
import CommonMask from "@/helpers/masks";
import { InvestmentRequest } from "@/models/investments/investment.request";
import useCustomStyles from "./style";
import {
  declaration,
  maritalStatus,
  nationality,
  pixKeyTypes,
} from "@/utils/options";
import { getCountries } from "@/services/common";
import BtnDefault from "@/components/BtnDefault";
import { getOpportunity } from "@/services/opportunities";
import LoadingComp from "@/components/Loading";
import { getInvestmentContract } from "@/services/investments";
import { getPersonalInfo } from "@/services/user";
import ModalDefault from "@/components/ModalDefault";
import { useIsFocused } from "@react-navigation/native";

type Summary = InvestmentRequest & {
  full_name: string;
  email: string;
  phone: string;
};

type SumamryProps = {
  summary: Partial<Summary>;
  onNext: (data: Partial<InvestmentRequest>) => void;
  opportunityId: number;
} & SceneRendererProps;

const Summary: React.FC<SumamryProps> = ({
  summary,
  opportunityId,
  onNext,
}) => {
  const isFocused = useIsFocused();
  const styles = useCustomStyles();
  const { control, getValues, reset } = useForm<Summary>({ disabled: true });
  const [checked, setChecked] = useState(false);
  const [invalidIncome, setInvalidIncome] = useState(false);
  const [showInvalidIncome, setShowInvalidIncome] = useState(false);
  const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
    queryKey: [getCountries.name],
    queryFn: getCountries,
  });
  const { data: opportunity, isLoading: loading } = useQuery({
    queryKey: [getOpportunity.name, opportunityId],
    queryFn: () => getOpportunity(opportunityId),
    enabled: !!opportunityId,
  });
  const { mutateAsync, isPending } = useMutation({
    mutationKey: [getInvestmentContract.name],
    mutationFn: getInvestmentContract,
  });
  const { data: personalInfo, isLoading } = useQuery({
    queryKey: [getPersonalInfo.name],
    queryFn: getPersonalInfo,
  });

  const saveReportFile = async (base64pdf: any) => {
    const fileUri = FileSystem.cacheDirectory + "contrato.pdf";
    await FileSystem.writeAsStringAsync(
      fileUri,
      base64pdf.replace(/^data:application\/pdf;base64,/, ""),
      { encoding: FileSystem.EncodingType.Base64 }
    );

    if (await Sharing.isAvailableAsync()) {
      if (Platform.OS === "ios") {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/pdf",
          dialogTitle: "Abrir ou compartilhar PDF",
        });
        return;
      }
      const contentUri = await FileSystem.getContentUriAsync(fileUri);
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: contentUri,
        flags: 1,
        type: "application/pdf",
      });
    } else {
      alert("Compartilhamento não disponível.");
    }
  };

  const openContract = async () => {
    try {
      const data = await mutateAsync({
        opportunity_id: opportunityId,
        quota_quantity: summary.quota_quantity || 0,
      });

      const convertBlobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result;
            if (typeof result === "string") {
              resolve(result.split(",")[1]);
            } else {
              reject(new Error("Tipo do resultado inesperado!"));
            }
          };

          reader.onerror = () => reject(new Error("Falha ao ler blob!"));
          reader.readAsDataURL(blob);
        });
      };

      const base64pdf = await convertBlobToBase64(data);
      saveReportFile(base64pdf);
    } catch {}
  };

  useEffect(() => {
    reset(summary);
  }, [summary]);

  useEffect(() => {
    if (personalInfo && opportunity) {
      const value =
        (summary.quota_quantity || 0) *
        opportunity.monetary.min_investment_value;
      const income = personalInfo.annual_income / 100;
      const insufficient = value / income < 0.1;
      let declarationValue = 0;
      switch (summary.declaration) {
        case "less_than_or_equal_200_thousand":
          declarationValue = 200000;
          break;
        case "greater_than_200_thousand_less_than_1_million":
          declarationValue = 999999;
          break;
        case "greater_than_or_equal_1_million":
          declarationValue = 1000000;
          break;
        default:
          break;
      }

      setInvalidIncome(insufficient);
      if (declarationValue < income || (insufficient && isFocused)) {
        setShowInvalidIncome(true);
      }
    }
  }, [isFocused, opportunity, personalInfo, summary]);

  if (loading || isLoadingCountries || isLoading) return <LoadingComp />;

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1, gap: 8 }}>
      {isPending && (
        <View style={styles.loading}>
          <LoadingComp transparent />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <List.AccordionGroup>
          <List.Accordion
            style={styles.accordionStyle}
            containerStyle={{ marginVertical: 8 }}
            id="1"
            title={<Text style={styles.titleStyle}>Dados pessoais</Text>}
          >
            <View style={{ paddingVertical: 16, gap: 0 }}>
              <Controller
                name="full_name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Nome:"
                    placeholder="Nome"
                    onChangeText={field.onChange}
                    setValue={field.onChange}
                  />
                )}
              />
              <View style={styles.formRowContainer}>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="investor_personal_information.birth_date"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={moment(field.value).format("DD/MM/YYYY")}
                        placeholder="Data de nascimento"
                        label="Data de nascimento:"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="investor_personal_information.nationality"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        form={undefined}
                        value={
                          nationality.find((item) => item.id === field.value)
                            ?.value || ""
                        }
                        arr={{ list: nationality }}
                        label="Nacionalidade"
                        fieldName="nacionalidade"
                        placeholder="Nacionalidade"
                        onSelect={field.onChange}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.formRowContainer}>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="investor_personal_information.rg"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value}
                        label="RG:"
                        placeholder="RG"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="investor_personal_information.cpf"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={CommonMask.cpf(field.value)}
                        label="CPF:"
                        placeholder="CPF"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.formRowContainer}>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="investor_personal_information.issuing_entity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value}
                        label="Orgão Emissor:"
                        placeholder="Orgão Emissor"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="investor_personal_information.marital_status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        //
                        form={undefined}
                        value={
                          maritalStatus.find((item) => item.id === field.value)
                            ?.value || ""
                        }
                        arr={{ list: maritalStatus }}
                        fieldName="estado civil"
                        label="Estado Civil:"
                        placeholder="Estado Civil"
                        onSelect={field.onChange}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.formRowContainer}>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="investor_personal_information.company"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value}
                        label="Empresa:"
                        placeholder="Empresa"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="investor_personal_information.job"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value}
                        label="Profissão:"
                        placeholder="Profissão"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.formRowContainer}>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="investor_personal_information.role"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value}
                        label="Cargo:"
                        placeholder="Cargo"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Controller
                  name="investor_personal_information.exposed_politically"
                  control={control}
                  render={({ field }) => (
                    <Checkbox.Item
                      mode="android"
                      rippleColor="transparent"
                      onPress={field.onChange}
                      status={field.value ? "checked" : "unchecked"}
                      label="Sou uma pessoa politicamente exposta:"
                      style={styles.checkbox}
                      labelStyle={styles.checkboxLabelStyle}
                    />
                  )}
                />
              </View>
            </View>
          </List.Accordion>
          <List.Accordion
            style={styles.accordionStyle}
            containerStyle={{ marginVertical: 8 }}
            id="2"
            title={<Text style={styles.titleStyle}>Dados de Contato</Text>}
          >
            <View style={{ paddingVertical: 16 }}>
              <View style={styles.formRowContainer}>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value}
                        label="E-mail:"
                        placeholder="E-mail"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={CommonMask.phone(field.value)}
                        label="Telefone:"
                        placeholder="Telefone"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </List.Accordion>
          <List.Accordion
            style={styles.accordionStyle}
            containerStyle={{ marginVertical: 8 }}
            titleStyle={styles.titleStyle}
            id="3"
            title={<Text style={styles.titleStyle}>Dados de Endereço</Text>}
          >
            <View style={{ paddingVertical: 16 }}>
              <View style={styles.formRowContainer}>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="address.country_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        //
                        form={undefined}
                        arr={{
                          list: countries.map?.((country) => ({
                            id: country.id.toString(),
                            value: country.name,
                          })),
                        }}
                        value={
                          countries?.find(
                            (item) => item.id.toString() === field.value
                          )?.name || ""
                        }
                        placeholder="País"
                        label="País:"
                        fieldName="País"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="address.zip_code"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={CommonMask.cep(field.value)}
                        label="CEP:"
                        placeholder="CEP"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.formRowContainer}>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="address.city"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value}
                        label="Cidade:"
                        placeholder="Cidade"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="address.state"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value}
                        label="Estado:"
                        placeholder="Estado"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Controller
                  name="address.street_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value}
                      label="Endereço:"
                      placeholder="Endereço"
                      setValue={field.onChange}
                    />
                  )}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Controller
                  name="address.district"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value}
                      label="Bairro:"
                      placeholder="Bairro"
                      setValue={field.onChange}
                    />
                  )}
                />
              </View>

              <View style={styles.formRowContainer}>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="address.number"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value}
                        label="Número:"
                        placeholder="Número"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="address.complement"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value}
                        label="Complemento:"
                        placeholder="Complemento"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </List.Accordion>
          <List.Accordion
            style={styles.accordionStyle}
            containerStyle={{ marginVertical: 8 }}
            id="4"
            title={<Text style={styles.titleStyle}>Dados PIX</Text>}
          >
            <View style={{ paddingVertical: 16 }}>
              <View style={{ flex: 1 }}>
                <Controller
                  name="pix.type"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      form={undefined}
                      arr={{ list: pixKeyTypes }}
                      value={
                        pixKeyTypes.find((item) => item.id === field.value)
                          ?.value || ""
                      }
                      fieldName="Tipo de chave PIX"
                      label="Tipo de chave PIX:"
                      placeholder="Tipo de chave PIX"
                      onSelect={field.onChange}
                    />
                  )}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Controller
                  name="pix.key"
                  control={control}
                  rules={{ required: "Campo obrigatório" }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      mask={
                        getValues("pix.type") as React.ComponentProps<
                          typeof Input
                        >["mask"]
                      }
                      label="Chave:"
                      placeholder="Chave"
                      onChangeText={field.onChange}
                      error={fieldState.invalid}
                      txtError={fieldState.error?.message}
                    />
                  )}
                />
              </View>
            </View>
          </List.Accordion>
          <List.Accordion
            style={styles.accordionStyle}
            containerStyle={{ marginVertical: 8 }}
            id="5"
            title={
              <Text style={styles.titleStyle}>Dados sobre o Investimento </Text>
            }
          >
            <View style={{ paddingVertical: 16 }}>
              <View style={{ flex: 1 }}>
                <Controller
                  name="quota_quantity"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={
                        "R$ " +
                        CommonMask.currency(
                          (
                            (field.value || 1) *
                            (opportunity?.monetary.min_investment_value || 0)
                          )?.toString() || ""
                        )
                      }
                      label="Valor do investimento:"
                      placeholder="Valor do investimento"
                    />
                  )}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Controller
                  name="anonymous"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value ? "Sim" : "Não"}
                      label="Investir de forma anônima:"
                      placeholder="Investir de forma anônima"
                    />
                  )}
                />
              </View>
            </View>
          </List.Accordion>
          <List.Accordion
            style={styles.accordionStyle}
            containerStyle={{ marginVertical: 8 }}
            id="6"
            title={
              <Text style={styles.titleStyle}>
                Declaração de perfil do investidor{" "}
              </Text>
            }
          >
            <View style={{ paddingVertical: 16 }}>
              <View style={{ flex: 1 }}>
                <Controller
                  name="declaration"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      multiline
                      {...field}
                      value={
                        declaration[field.value as keyof typeof declaration]
                      }
                      label="Possui renda financeira:"
                      placeholder="Possui renda financeira"
                    />
                  )}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Controller
                  name="other_crowdfunding_platforms"
                  control={control}
                  rules={{ required: "Campo obrigatório" }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      value={
                        "R$ " + CommonMask.currency(field.value.toString())
                      }
                      label="Valor investido em outras plataformas:"
                      placeholder="Valor investido em outras plataformas"
                      onChangeText={field.onChange}
                      error={fieldState.invalid}
                      txtError={fieldState.error?.message}
                    />
                  )}
                />
              </View>
            </View>
          </List.Accordion>
        </List.AccordionGroup>
        <View style={styles.checkboxContainer}>
          <Checkbox.Android
            android_ripple={{ color: "transparent" }}
            rippleColor="transparent"
            onPress={() => setChecked(!checked)}
            status={checked ? "checked" : "unchecked"}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabelStyle}>
            Eu li e aceito os{" "}
            <Text
              style={{ textDecorationLine: "underline" }}
              onPress={openContract}
            >
              Termos do Contrato.
            </Text>
          </Text>
        </View>
      </ScrollView>
      <BtnDefault
        label="Avançar"
        disabled={!checked || invalidIncome}
        style={{ marginHorizontal: 16 }}
        onPress={() => onNext({ user_agreed_at: new Date() })}
      />

      <ModalDefault
        visible={showInvalidIncome}
        setVisible={setShowInvalidIncome}
        title="Declaração não compatível"
        desc="Segundo as normas da Resolução CVM nº 88, o investidor só poderá investir até 10% de sua renda bruta anual, considerando os investimentos feitos nesta plataforma somados aos investimentos feitos em outras plataformas. Reconsidere o seu valor de investimento"
      />
    </SafeAreaView>
  );
};

export default Summary;
