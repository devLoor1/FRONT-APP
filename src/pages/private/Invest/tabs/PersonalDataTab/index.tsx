import React, { memo, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Checkbox, List, Text } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";

import useCustomStyles from "./style";
import { SceneRendererProps } from "react-native-tab-view";
import { useQuery } from "@tanstack/react-query";
import { getPersonalInfo } from "@/services/user";
import { PersonalInfo } from "@/models/user/personalInformation";
import Input from "@/components/Input";
import moment from "moment";
import SelectSearch from "@/components/SelectSearch";
import { getCountries } from "@/services/common";
import Select from "@/components/Select";
import CommonMask from "@/helpers/masks";
import LoadingComp from "@/components/Loading";
import { getMe } from "@/services/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Analytics } from "@/helpers/analytics";
import BtnDefault from "@/components/BtnDefault";
import { getOpportunityPix } from "@/services/opportunities";
import { Me } from "@/models/user/me.response";
import { OpportunityPix } from "@/models/opportunities/pix";
import { nationality, maritalStatus, pixKeyTypes } from "@/utils/options";

type PersonalDataTabProps = {
  opportunityId: number;
  onNext: () => void;
} & SceneRendererProps;

const initValues = (obj: any) => {
  let newObj: Record<string, string | number | object> = {};
  Object.entries(obj as Record<string, string | number | object>).map(
    ([field, value]) => {
      if (!value) {
        newObj[field] = "";
      } else if (typeof value === "object") {
        newObj[field] = initValues(value);
      } else {
        newObj[field] = value;
      }
    }
  );

  return newObj;
};

type PersonalDataForm = PersonalInfo & Me & OpportunityPix;

const PersonalDataTab: React.FC<PersonalDataTabProps> = (props) => {
  const styles = useCustomStyles();
  const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
    queryKey: [getCountries.name],
    queryFn: getCountries,
  });
  const { data: me, isLoading: isLoadingMe } = useQuery({
    queryKey: [getMe.name],
    queryFn: getMe,
  });
  const { data: personalInfo, isLoading } = useQuery({
    queryKey: [getPersonalInfo.name],
    queryFn: getPersonalInfo,
  });
  const { data: pix, isLoading: isLoadingPix } = useQuery({
    queryKey: [getOpportunityPix.name],
    queryFn: () => getOpportunityPix(props.opportunityId),
  });
  const { control, getValues, reset } = useForm<PersonalDataForm>({
    disabled: true,
  });

  const formatKey = (field: string) => {
    switch (getValues("type")) {
      case "cpf":
        return CommonMask.cpf(field);
      case "cnpj":
        return CommonMask.cnpj(field);
      case "phone":
        return CommonMask.phone(field);
      case "email":
        return CommonMask.email(field);
      case "random":
        return field;
      default:
        return "";
    }
  };

  useEffect(() => {
    if (personalInfo && me && pix) {
      reset(initValues({ ...personalInfo, ...me, ...pix }));
    }
  }, [personalInfo, me, pix]);

  if (isLoading || isLoadingMe || isLoadingPix || isLoadingCountries)
    return <LoadingComp />;

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1, gap: 8 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <List.AccordionGroup>
          <List.Accordion
            style={styles.accordionStyle}
            containerStyle={{ marginVertical: 8 }}
            id="1"
            title={
              <Text style={styles.titleStyle}>
                Dados pessoais <Text style={styles.required}>*</Text>
              </Text>
            }
          >
            <View style={{ paddingVertical: 16, gap: 0 }}>
              <Controller
                name="full_name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    outlinedLabel
                    label="Nome"
                    placeholder="Nome"
                    onChangeText={field.onChange}
                    setValue={field.onChange}
                  />
                )}
              />
              <View style={styles.formRowContainer}>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="birth_date"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        outlinedLabel
                        value={moment(field.value).format("DD/MM/YYYY")}
                        placeholder="Data de nascimento"
                        label="Data de nascimento"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="nationality"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        outlinedLabel
                        form={undefined}
                        value={
                          nationality.find((item) => item.id === field.value)
                            ?.value || ""
                        }
                        arr={{ list: nationality }}
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
                    name="rg"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        outlinedLabel
                        value={field.value}
                        label="RG"
                        placeholder="RG"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="cpf"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        outlinedLabel
                        value={CommonMask.cpf(field.value)}
                        label="CPF"
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
                    name="issuing_entity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        outlinedLabel
                        value={field.value}
                        label="Orgão Emissor"
                        placeholder="Orgão Emissor"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="marital_status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        outlinedLabel
                        form={undefined}
                        value={
                          maritalStatus.find((item) => item.id === field.value)
                            ?.value || ""
                        }
                        arr={{ list: maritalStatus }}
                        fieldName="estado civil"
                        label="Estado Civil"
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
                    name="company"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        outlinedLabel
                        value={field.value}
                        label="Empresa"
                        placeholder="Empresa"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="job"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        outlinedLabel
                        value={field.value}
                        label="Profissão"
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
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        outlinedLabel
                        value={field.value}
                        label="Cargo"
                        placeholder="Cargo"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Controller
                  name="exposed_politically"
                  control={control}
                  render={({ field }) => (
                    <Checkbox.Item
                      mode="android"
                      rippleColor="transparent"
                      onPress={field.onChange}
                      status={field.value ? "checked" : "unchecked"}
                      label="Sou uma pessoa politicamente exposta"
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
            title={
              <Text style={styles.titleStyle}>
                Dados de Contrato <Text style={styles.required}>*</Text>
              </Text>
            }
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
                        outlinedLabel
                        value={field.value}
                        label="E-mail"
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
                        outlinedLabel
                        value={CommonMask.phone(field.value)}
                        label="Telefone"
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
            title={
              <Text style={styles.titleStyle}>
                Endereço <Text style={styles.required}>*</Text>
              </Text>
            }
          >
            <View style={{ paddingVertical: 16 }}>
              <View style={styles.formRowContainer}>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="address.country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        form={undefined}
                        outlinedLabel
                        arr={{
                          list: countries.map?.((country) => ({
                            id: country.abbreviation,
                            value: country.name,
                          })),
                        }}
                        value={
                          countries?.find(
                            (item) =>
                              item.abbreviation === field.value?.abbreviation
                          )?.name || ""
                        }
                        placeholder="País"
                        label="País"
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
                        outlinedLabel
                        value={CommonMask.cep(field.value)}
                        label="CEP"
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
                        outlinedLabel
                        value={field.value}
                        label="Cidade"
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
                        outlinedLabel
                        value={field.value}
                        label="Estado"
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
                      outlinedLabel
                      value={field.value}
                      label="Endereço"
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
                      outlinedLabel
                      value={field.value}
                      label="Bairro"
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
                        outlinedLabel
                        value={field.value}
                        label="Número"
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
                        outlinedLabel
                        value={field.value}
                        label="Complemento"
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
            title={
              <Text style={styles.titleStyle}>
                Dados PIX <Text style={styles.required}>*</Text>
              </Text>
            }
          >
            <View style={{ paddingVertical: 16 }}>
              <View style={styles.formRowContainer}>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        form={undefined}
                        outlinedLabel
                        arr={{ list: pixKeyTypes }}
                        value={
                          pixKeyTypes.find((item) => item.id === field.value)
                            ?.value || ""
                        }
                        fieldName="Tipo de chave PIX"
                        label="Tipo de chave PIX"
                        placeholder="Tipo de chave PIX"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    name="key"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        outlinedLabel
                        value={formatKey(field.value)}
                        label="Chave"
                        placeholder="Chave"
                        setValue={field.onChange}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </List.Accordion>
        </List.AccordionGroup>
      </ScrollView>
      <BtnDefault
        label="Salvar e avançar"
        style={{ marginHorizontal: 16 }}
        onPress={() => {
          Analytics({
            eventName: "OportInvestirAgora_ConfirmaDadosPessoais",
          });
          props.jumpTo("crowdfunding");
          props.onNext();
        }}
      />
    </SafeAreaView>
  );
};

export default memo(PersonalDataTab);
