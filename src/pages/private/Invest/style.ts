import { StyleSheet } from "react-native";
import { useTheme } from "@/context/MyThemeContext";

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 24,
      gap: 16,
    },
    head: {
      borderBottomWidth: 1,
      borderColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[200],
      paddingBottom: 16,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
      fontSize: 14,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    description: {
      color: theme.customColors.neutrals[400],
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
      lineHeight: 16,
    },
    quotaContainer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: theme.colors.border,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
    },
    quotaTitle: { fontFamily: theme.fonts.regular, fontSize: 12 },
    quotaValue: { fontFamily: theme.fonts.bold, color: theme.colors.primary },
    anonymousContainer: {
      padding: 16,
      borderRadius: 12,
      gap: 8,
      backgroundColor: theme.customColors.neutrals[100],
    },
    checkbox: {
      flexDirection: "row-reverse",
      justifyContent: "flex-start",
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    codesRow: { flexDirection: "row", gap: 8 },
    code: {
      height: 26,
      width: 96,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.customColors.secondary.default,
    },
    codeTxt: {
      color: theme.customColors.baseWhite,
      fontSize: 12,
      fontFamily: theme.fonts.semiBold,
    },
    paramsRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 8,
    },
    paramsItem: {
      flex: 1,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[800]
        : "#FFFFFF",
      borderRadius: 8,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      padding: 8,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
    },
    paramsItemTitle: {
      textAlign: "center",
      color: theme.dark
        ? theme.customColors.neutrals[500]
        : theme.customColors.baseBlack,
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
    paramsItemDesc: {
      textAlign: "center",
      color: theme.dark
        ? theme.customColors.neutrals[300]
        : theme.customColors.baseBlack,
      fontSize: 14,
      fontFamily: theme.fonts.bold,
    },
    quotas: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      // marginBottom: 16,
    },
    input: {
      borderRadius: 4,
      width: 60,
      height: 50,
      textAlign: "center",
      color: theme.colors.text,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[700]
        : "transparent",
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.secondary[600],
    },
    quotasTitle: {
      textAlign: "center",
      color: theme.colors.text,
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      marginBottom: 16,
    },
    list: {
      // marginTop: 16,
      marginBottom: 24,
    },
    listItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[200],
    },
    listItemTitle: {
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
    listItemDesc: {
      color: theme.colors.text,
      fontSize: 14,
      fontFamily: theme.fonts.bold,
    },
    footer: {
      paddingBottom: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    totBlock: {
      backgroundColor: theme.customColors.baseBlack,
      marginBottom: 12,
      height: 41,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    totTxt: {
      textTransform: "uppercase",
      fontSize: 14,
      fontFamily: theme.fonts.extraBold,
      color: theme.customColors.baseWhite,
    },
    codePromo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 41,
      marginBottom: 12,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[800]
        : "#FFFFFF",
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    codePromoTxt: {
      fontSize: 14,
      fontFamily: theme.fonts.semiBold,
      color: theme.dark
        ? theme.customColors.neutrals[400]
        : theme.customColors.secondary.default,
    },
  });
};
