import React from "react";
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

type PersonalDataTabProps = {
  onNext: () => void;
} & SceneRendererProps;

const list = [
  { id: "brazilian", value: "Brasileiro Nato" },
  {
    id: "naturalized_brazilian",
    value: "Brasileiro Naturalizado",
  },
  { id: "foreigner", value: "Estrangeiro" },
];

const maritalStatus = [
  { id: "single", value: "Solteiro(a)" },
  { id: "married", value: "Casado(a)" },
  { id: "widow", value: "Viúvo(a)" },
  { id: "other", value: "Outro" },
];

const PersonalDataTab: React.FC<PersonalDataTabProps> = (props) => {
  const styles = useCustomStyles();
  const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
    queryKey: [getCountries.name],
    queryFn: getCountries,
  });
  const { data: personalInfo, isLoading } = useQuery({
    queryKey: [getPersonalInfo.name],
    queryFn: getPersonalInfo,
  });
  const { control } = useForm<PersonalInfo>({
    defaultValues: personalInfo,
    disabled: true,
  });

  if (isLoading) return <LoadingComp />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <List.AccordionGroup>
        <List.Accordion
          style={styles.accordionStyle}
          containerStyle={{ marginVertical: 8 }}
          titleStyle={styles.titleStyle}
          id="1"
          title="Dados pessoais"
        >
          <View style={{ paddingVertical: 16, gap: 0 }}>
            <Controller
              name="full_name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  mode="outlined"
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
                      value={moment(field.value).format("DD/MM/YYYY")}
                      placeholder="Data de nascimento"
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
                      form={undefined}
                      value={
                        list.find((item) => item.id === field.value)?.value ||
                        ""
                      }
                      arr={{ list }}
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
                      value={field.value}
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
                      mask="cpf"
                      value={field.value}
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
                      value={field.value}
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
                      form={undefined}
                      value={
                        maritalStatus.find((item) => item.id === field.value)
                          ?.value || ""
                      }
                      arr={{ list: maritalStatus }}
                      fieldName="estado civil"
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
                      value={field.value}
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
                      value={field.value}
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
                      value={field.value}
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
          titleStyle={styles.titleStyle}
          id="2"
          title="Dados de Contrato"
        >
          <View style={{ padding: 16 }} />
        </List.Accordion>
        <List.Accordion
          style={styles.accordionStyle}
          containerStyle={{ marginVertical: 8 }}
          titleStyle={styles.titleStyle}
          id="3"
          title="Endereço"
        >
          <View style={{ padding: 16 }} />
        </List.Accordion>
        <List.Accordion
          style={styles.accordionStyle}
          containerStyle={{ marginVertical: 8 }}
          titleStyle={styles.titleStyle}
          id="4"
          title="Dados PIX"
        >
          <View style={{ padding: 16 }} />
        </List.Accordion>
      </List.AccordionGroup>
    </ScrollView>
  );
};

export default PersonalDataTab;
