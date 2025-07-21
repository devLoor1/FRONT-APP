import React, { forwardRef } from "react";
import {
  DimensionValue,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
} from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import CommonMask from "../../helpers/masks";
import { useTheme } from "@/context/MyThemeContext";

type InputType = {
  placeholder?: string;
  value: string;
  defaultValue?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  keyboardType?: KeyboardTypeOptions | undefined;
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  secureTextEntry?: boolean;
  right?: React.ReactElement | null;
  prefix?: React.ReactElement | null;
  error?: boolean;
  txtError?: string;
  mask?: "cpf" | "cep" | "phone" | "currency" | "date" | "cnpj" | undefined;
  maxLength?: number;
  width?: DimensionValue;
  editable?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  onFocus?:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
  onPressOut?:
    | ((e: NativeSyntheticEvent<NativeTouchEvent>) => void)
    | undefined;
  border?: boolean;
  borderSolid?: boolean;
  borderColor?: string;
  bg?: string;
  marginBottom?: number;
  label?: string;
  required?: boolean;
  txtCenter?: boolean;
  height?: number;
  mode?: "flat" | "outlined";
  onChangeText?: (((text: string) => void) & Function) | undefined;
  outlinedLabel?: boolean;
};

const Input: React.ForwardRefRenderFunction<RNTextInput, InputType> = (
  {
    placeholder,
    value,
    setValue,
    defaultValue,
    keyboardType = undefined,
    autoComplete = "off",
    secureTextEntry = false,
    right = null,
    prefix = null,
    error = false,
    txtError = "",
    mask,
    maxLength = 1000,
    width,
    editable = true,
    disabled = false,
    multiline = false,
    textContentType,
    onFocus,
    onPressOut,
    autoCapitalize,
    border = false,
    borderSolid = false,
    borderColor,
    bg,
    marginBottom = 8,
    label,
    required,
    txtCenter,
    mode = "outlined",
    onChangeText,
    outlinedLabel = false,
  },
  ref
) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    input: {
      backgroundColor: bg ? bg : theme?.customColors?.inputBg || "#EFEFEF",
      fontSize: 14,
      fontFamily: theme?.fonts?.semiBold || "NunitoSans_600SemiBold",
      width: width || "auto",
      borderWidth: border ? 1 : 0,
      borderRadius: 12,
      borderStyle: borderSolid ? "solid" : "dashed",
      borderColor: borderColor
        ? borderColor
        : theme?.customColors?.neutrals?.[400] || "#969595",
      textAlign: txtCenter ? "center" : "left",
    },
    labelContainer: {
      flexDirection: "row",
    },
    label: {
      color: theme?.navigation?.dark
        ? theme?.customColors?.neutrals?.[400] || "#969595"
        : theme?.customColors?.neutrals?.[700] || "#504F4F",
      marginBottom: 6,
      fontFamily: theme?.fonts?.semiBold || "NunitoSans_600SemiBold",
      fontSize: 14,
    },
  });

  function handleChange(txt: string) {
    let maskValue = "";
    switch (mask) {
      case "cpf":
        maskValue = CommonMask.cpf(txt);
        break;
      case "cnpj":
        maskValue = CommonMask.cnpj(txt);
        break;
      case "cep":
        maskValue = CommonMask.cep(txt);
        break;
      case "phone":
        maskValue = CommonMask.phone(txt);
        break;
      case "currency":
        maskValue = CommonMask.currency(txt);
        break;
      case "date":
        maskValue = CommonMask.date(txt);
        break;
      default:
        maskValue = txt;
        break;
    }
    setValue?.(maskValue);
    return maskValue;
  }

  return (
    <View style={{ marginBottom }}>
      {label && !outlinedLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && (
            <Text
              style={{
                color: theme?.customColors?.error?.default || "#EE4848",
              }}
            >
              *
            </Text>
          )}
        </View>
      )}
      <TextInput
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onChangeText={
          onChangeText
            ? (txt) => (mask ? onChangeText(handleChange(txt)) : onChangeText)
            : (txt) => (mask ? handleChange(txt) : setValue?.(txt))
        }
        mode={mode}
        label={outlinedLabel ? label : undefined}
        autoComplete={autoComplete}
        keyboardType={keyboardType}
        activeOutlineColor={
          border ? "transparent" : theme?.navigation?.colors?.text || "#39393A"
        }
        placeholderTextColor={theme?.navigation?.colors?.text || "#39393A"}
        secureTextEntry={secureTextEntry}
        outlineColor="transparent"
        placeholder={placeholder}
        right={right}
        left={prefix}
        error={error}
        maxLength={maxLength}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        editable={editable}
        disabled={disabled}
        multiline={multiline}
        textContentType={textContentType}
        onFocus={onFocus}
        onPressOut={onPressOut}
        autoCapitalize={autoCapitalize}
        style={styles.input}
        theme={{
          fonts: {
            default: {
              fontFamily: theme?.fonts?.semiBold || "NunitoSans_600SemiBold",
            },
          },
        }}
      />
      {error && (
        <HelperText
          type="error"
          visible={error}
          theme={{
            colors: { error: theme?.customColors?.error?.default || "#EE4848" },
          }}
        >
          {txtError}
        </HelperText>
      )}
    </View>
  );
};

export default React.memo(forwardRef(Input));
