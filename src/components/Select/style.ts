import { StyleSheet } from "react-native";
import { useTheme } from "@/context/MyThemeContext";

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    labelContainer: {
      flexDirection: "row",
    },
    label: {
      color: theme.dark
        ? theme.customColors.neutrals[400]
        : theme.customColors.neutrals[700],
      marginBottom: 6,
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
    },
    option: {
      width: "100%",
      padding: 16,
    },
    optionTxt: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular,
      fontSize: 14,
    },
    input: {
      backgroundColor: theme.customColors.inputBg,
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
      width: "100%",
    },
    arrow: {
      position: "absolute",
      right: 16,
      top: 24,
    },
    bottomSheetContainer: { flex: 1, paddingTop: 24, gap: 24 },
    search: {
      borderRadius: 12,
      borderColor: "rgba(255, 255, 255, 0.3)",
      borderWidth: 1,
      shadowOpacity: 0,
      backgroundColor: theme.customColors.inputBg,
      height: 55,
      shadowColor: "transparent",
    },
    searchInput: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular,
      shadowColor: "transparent",
      fontSize: 14,
    },
    supportTxt: {
      fontSize: 12,
      color: theme.colors.text,
      marginVertical: 12,
    },
    title: {
      fontFamily: theme.fonts.bold,
      fontSize: 18,
      color: theme.colors.text,
    },
  });
};
