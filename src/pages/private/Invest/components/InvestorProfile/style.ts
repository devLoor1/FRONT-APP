import { StyleSheet } from "react-native";
import { useTheme } from "@/context/MyThemeContext";

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: 16,
    },
    header: {
      marginTop: -5,
      marginHorizontal: -16,
      marginBottom: 24,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.customColors.secondary[600],
    },
    headTitle: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 18,
    },
    btnClose: {
      backgroundColor: theme.customColors.baseWhite,
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[700]
        : "#FFFFFF",
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
      borderRadius: 8,
      marginBottom: 24,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    cardTitle: {
      color: theme.colors.text,
      fontSize: 14,
      marginBottom: 2,
      fontFamily: theme.fonts.bold,
    },
    warnTxt: {
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      color: theme.customColors.secondary.default,
    },
    checkBlock: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },
    checkDesc: {
      flex: 1,
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
    },
    footer: {
      flexDirection: "row",
      gap: 8,
    },
  });
};
