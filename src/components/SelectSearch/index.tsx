import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  HelperText,
  Searchbar,
  TextInput,
  Divider,
  RadioButton,
} from "react-native-paper";
import { useCustomStyles } from "./style";
import { useTheme } from "@/context/MyThemeContext";
import ArrowIcon from "@/../assets/newSvgs/icons/keyboard_arrow_down.svg";
import BottomSheet from "../BottomSheet";
import RBSheet from "react-native-raw-bottom-sheet";
import RBSheetRef from "@/helpers/types/rawBottomSheetRef";

type InputType = {
  placeholder?: string;
  value: string;
  form: any;
  arr: string[] | null;
  setValue: any;
  fieldName: string;
  error?: boolean;
  txtError?: string;
  handleSearch(filter: string): Promise<void>;
  loading: boolean;
  marginBottom?: number;
  label?: string;
  required?: boolean;
};

export default function SelectSearch({
  placeholder,
  value,
  setValue,
  form,
  arr,
  fieldName,
  error = false,
  txtError = "",
  handleSearch,
  loading,
  marginBottom = 8,
  label,
  required,
}: InputType) {
  const { height } = useWindowDimensions();
  const [searchField, setSearchField] = useState("");
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const btSheetRef = useRef<RBSheetRef>(null);

  const onChangeSearch = (query: string) => setSearchField(query);

  useEffect(() => {
    if (searchField.length >= 4) {
      handleSearch(searchField);
    }
  }, [searchField]);

  function renderList() {
    if (searchField.length < 4) {
      return (
        <Text style={styles.supportTxt}>Digite pelo menos 4 caracteres...</Text>
      );
    } else if (loading) {
      return (
        <View style={{ padding: 12 }}>
          <ActivityIndicator color={theme.customColors.secondary.default} />
        </View>
      );
    } else if (arr && arr.length) {
      return (
        <FlatList
          scrollEnabled={false}
          data={arr}
          renderItem={({ item }) => (
            <RadioButton.Item
              label={item}
              style={[
                styles.option,
                { justifyContent: "space-between", width: "100%" },
              ]}
              labelStyle={{
                fontFamily: theme.fonts.regular,
                color: theme.colors.text,
              }}
              color={theme.customColors.secondary.default}
              uncheckedColor={theme.colors.text}
              value={item}
              status={item === value ? "checked" : "unchecked"}
              onPress={() => {
                btSheetRef.current?.close();
                setValue({ ...form, [fieldName]: item });
              }}
            />
          )}
          ItemSeparatorComponent={() => (
            <Divider style={{ backgroundColor: theme.colors.border }} />
          )}
        />
      );
    } else if (!arr?.length && !loading) {
      return (
        <Text style={styles.supportTxt}>Nenhuma profissão encontrada...</Text>
      );
    }
  }

  return (
    <View style={{ marginBottom: marginBottom }}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label} </Text>
          {required && (
            <Text style={{ color: theme.customColors.error.default }}>*</Text>
          )}
        </View>
      )}
      <TouchableOpacity
        onPress={() => {
          btSheetRef.current?.open();
        }}
      >
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text}
          mode="outlined"
          editable={false}
          error={error}
          onTouchEnd={() => {
            btSheetRef.current?.open();
          }}
          outlineColor="transparent"
          activeOutlineColor={theme.colors.text}
          underlineColor="transparent"
          style={styles.input}
          theme={{ fonts: { regular: { fontFamily: theme.fonts.semiBold } } }}
        />
        <View style={styles.arrow}>
          <ArrowIcon
            color={theme.customColors.neutrals[400]}
            width={24}
            height={24}
          />
        </View>
      </TouchableOpacity>

      <BottomSheet
        refRBSheet={btSheetRef}
        height={height / 2}
        background={theme.dark ? theme.colors.background : "#FFFFFF"}
      >
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.title}>{label}</Text>
          <Searchbar
            placeholder="Buscar"
            onChangeText={onChangeSearch}
            value={searchField || ""}
            iconColor={theme.colors.text}
            placeholderTextColor={theme.colors.text}
            inputStyle={styles.searchInput}
            style={styles.search}
            onIconPress={() => {
              setSearchField("");
            }}
          />
          <ScrollView style={{ marginHorizontal: -16 }}>
            {renderList()}
          </ScrollView>
        </View>
      </BottomSheet>
      {error && (
        <HelperText
          type="error"
          visible={error}
          theme={{ colors: { error: theme.customColors.error.default } }}
        >
          {txtError}
        </HelperText>
      )}
    </View>
  );
}
