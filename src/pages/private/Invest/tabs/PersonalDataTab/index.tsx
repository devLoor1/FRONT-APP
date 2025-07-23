import React, { memo, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Checkbox, List, Text } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

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
import {
  nationality,
  maritalStatus,
  pixKeyTypes,
  countryCodes,
} from "@/utils/options";
import { InvestmentRequest } from "@/models/investments/investment.request";

type PersonalDataTabProps = {
  opportunityId: number;
  onNext: (data: Partial<InvestmentRequest>) => void;
} & SceneRendererProps;

/* const initValues = (obj: any) => {
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
}; */
type AnyObject = Record<string, any>;

function initValues<T extends AnyObject>(obj: T): T {
  const newObj = {} as T;

  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      (newObj as AnyObject)[key] = "";
    } else if (Array.isArray(value)) {
      (newObj as AnyObject)[key] = value.map((item) =>
        typeof item === "object" && item !== null
          ? initValues(item as AnyObject)
          : item
      );
    } else if (value instanceof Date) {
      (newObj as AnyObject)[key] = value;
    } else if (typeof value === "object") {
      (newObj as AnyObject)[key] = initValues(value as AnyObject);
    } else {
      (newObj as AnyObject)[key] = value;
    }
  });

  return newObj;
}

export type PersonalDataForm = PersonalInfo & Me & { pix: OpportunityPix };

const defaultValues: PersonalDataForm = {
  // PersonalInfo
  full_name: "",
  phone: "",
  nationality: "",
  gender: "",
  cpf: "",
  rg: "",
  issuing_entity: "",
  marital_status: "",
  company: "",
  job: "",
  role: "",
  annual_income: 0,
  exposed_politically: 0,
  birth_date: "",
  investor_company_information: null,
  address: {
    id: 0,
    street_name: "",
    city: "",
    complement: "",
    district: "",
    number: "",
    state: "",
    zip_code: "",
    country: {
      id: 0,
      name: "",
      abbreviation: "",
    },
  },
  bank_account: {
    bank_id: 0,
    agency: "",
    account: "",
    account_digit: "",
  },

  // Me
  email: "",
  type: "",
  account_validation_status: "",
  reason_for_deny: null,
  has_completed_personal_information: false,
  investor_profile: {
    id: 0,
    title: "",
    description: "",
    created_at: new Date(), // or new Date(0)
  },
  face_match: {
    status: "",
  },

  // OpportunityPix
  pix: {
    type: "",
    key: "",
  },
};

const PersonalDataTab: React.FC<PersonalDataTabProps> = (props) => {
  const styles = useCustomStyles();
  const [countryCode, setCountryCode] = useState(countryCodes[0].id);
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
  const { control, getValues, reset, watch, register, handleSubmit } =
    useForm<PersonalDataForm>({
      disabled: true,
      defaultValues,
      shouldUnregister: false,
    });

  const next: SubmitHandler<PersonalDataForm> = async () => {
    Analytics({
      eventName: "OportInvestirAgora_ConfirmaDadosPessoais",
    });
    const data = getValues();
    if (data.pix.type === "phone" && !data.pix.key.includes("+")) {
      data.pix.key = countryCode + data.pix.key;
    }

    props.jumpTo("crowdfunding");
    props.onNext({
      ...data,
      investor_personal_information: {
        birth_date: data.birth_date,
        nationality: data.nationality,
        gender: data.gender,
        cpf: data.cpf,
        rg: data.rg,
        issuing_entity: data.issuing_entity,
        marital_status: data.marital_status,
        company: data.company,
        job: data.job,
        role: data.role,
        exposed_politically: !!data.exposed_politically,
      },
      address: {
        ...data.address,
        country_id: data.address.country.id.toString(),
      },
      investor_company_information: { cnpj: "" },
    });
  };

  useEffect(() => {
    register("pix.type", { required: "Selecione um tipo" });
    register("pix.key", { required: "Campo obrigatório" });
  }, [register]);

  useEffect(() => {
    if (!personalInfo || !me || !pix) return;
    reset(initValues({ ...personalInfo, ...me, pix }));
  }, [personalInfo, me, pix, reset]);

  if (isLoading || isLoadingMe || isLoadingPix || isLoadingCountries)
    return <LoadingComp />;

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{ flex: 1, gap: 8, paddingBottom: 16 }}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
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
                Dados de Contato <Text style={styles.required}>*</Text>
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
                    defaultValue={{} as (typeof countries)[0]}
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
              <View style={{ flex: 1 }}>
                <Controller
                  name="pix.type"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      outlinedLabel
                      form={undefined}
                      disabled={false}
                      arr={{ list: pixKeyTypes }}
                      value={
                        pixKeyTypes.find((item) => item.id === field.value)
                          ?.value || ""
                      }
                      fieldName="Tipo de chave PIX"
                      label="Tipo de chave PIX"
                      placeholder="Tipo de chave PIX"
                      onSelect={field.onChange}
                    />
                  )}
                />
              </View>
              <View style={styles.formRowContainer}>
                {watch("pix.type") === "phone" && (
                  <Select
                    outlinedLabel
                    form={undefined}
                    disabled={false}
                    arr={{ list: countryCodes }}
                    value={
                      countryCodes.find((item) => item.id === countryCode)
                        ?.value || ""
                    }
                    fieldName="Selecione o código do país"
                    label=""
                    placeholder="Código do país"
                    onSelect={setCountryCode}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Controller
                    name="pix.key"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        outlinedLabel
                        disabled={!watch("pix.type")}
                        mask={
                          watch("pix.type") as React.ComponentProps<
                            typeof Input
                          >["mask"]
                        }
                        label="Chave *"
                        placeholder="Chave"
                        onChangeText={field.onChange}
                        error={fieldState.invalid}
                        txtError={fieldState.error?.message}
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
        onPress={handleSubmit(next)}
      />
    </SafeAreaView>
  );
};

export default memo(PersonalDataTab);
