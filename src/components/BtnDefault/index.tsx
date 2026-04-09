import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import React, { ReactNode } from "react";
import { useTheme } from "@/context/MyThemeContext";

type Props = {
  readonly label: string;
  readonly onPress: ((event: GestureResponderEvent) => void) | undefined;
  readonly white?: boolean;
  readonly disabled?: boolean;
  readonly marginBottom?: number;
  readonly icon?: ReactNode;
  readonly style?: any;
  readonly labelStyle?: TextStyle;
  readonly loading?: boolean;
  readonly bg?: string;
};

function getBackgroundColor({
  bg,
  white,
  theme,
}: {
  bg?: string;
  white?: boolean;
  theme: any;
}) {
  if (bg) return bg;
  if (white)
    return theme?.navigation?.dark
      ? theme?.customColors?.baseBlack ?? "#000000"
      : theme?.customColors?.baseWhite ?? "#FFFFFF";
  return theme?.customColors?.secondary?.default ?? "#007AFF";
}

function getBorderColor({
  bg,
  white,
  theme,
}: {
  bg?: string;
  white?: boolean;
  theme: any;
}) {
  if (bg) return bg;
  if (white)
    return theme?.navigation?.dark
      ? theme?.customColors?.baseWhite ?? "#FFFFFF"
      : theme?.customColors?.secondary?.default ?? "#007AFF";
  return theme?.customColors?.secondary?.default ?? "#007AFF";
}

function getTextColor({ white, theme }: { white?: boolean; theme: any }) {
  if (white)
    return theme?.navigation?.dark
      ? theme?.customColors?.baseWhite ?? "#FFFFFF"
      : theme?.customColors?.secondary?.default ?? "#007AFF";
  return theme?.customColors?.baseWhite ?? "#FFFFFF";
}

export default function BtnDefault({
  label,
  onPress,
  white = false,
  loading,
  disabled = false,
  marginBottom,
  style,
  labelStyle,
  icon,
  bg,
}: Props) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    btn: {
      height: 45,
      backgroundColor: getBackgroundColor({ bg, white, theme }),
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 100,
      borderWidth: 1,
      borderColor: getBorderColor({ bg, white, theme }),
      opacity: disabled ? 0.6 : 1,
      marginBottom: marginBottom,
      flexDirection: icon ? "row" : "column",
      gap: icon ? 10 : 0,
    },
    txt: {
      fontSize: 14,
      fontFamily: theme?.fonts?.semiBold || "NunitoSans_600SemiBold",
      color: getTextColor({ white, theme }),
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, style]}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor({ white, theme })}
        />
      ) : (
        <>
          {icon}
          <Text style={[styles.txt, labelStyle]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
