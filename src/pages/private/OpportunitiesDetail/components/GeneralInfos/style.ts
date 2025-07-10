import { StyleSheet } from "react-native";
import { useTheme } from "@/context/MyThemeContext";

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    logo: {
      width: 49,
      height: 49,
      borderRadius: 49,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[100],
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      elevation: 2,
      shadowColor: "rgba(0, 0, 0, 1)",
      shadowOffset: { width: -1, height: 3 },
      shadowRadius: 49,
      shadowOpacity: 0.25,
    },
    name: {
      color: theme.colors.text,
      fontSize: 14,
      fontFamily: theme.fonts.extraBold,
      marginBottom: 2,
      textTransform: "uppercase",
    },
    sector: {
      fontSize: 10,
      fontFamily: theme.fonts.semiBold,
      color: theme.customColors.neutrals[400],
      marginBottom: 8,
    },
    codesRow: { flexDirection: "row", gap: 8 },
    code: {
      height: 26,
      width: 96,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    codeTxt: {
      color: theme.customColors.baseWhite,
      fontSize: 12,
      fontFamily: theme.fonts.semiBold,
    },
    list: {
      marginVertical: 16,
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
      flex: 1,
      maxWidth: 150,
    },
    listItemDesc: {
      color: theme.colors.text,
      fontSize: 14,
      fontFamily: theme.fonts.bold,
      flex: 1,
      textAlign: "right",
    },
    midias: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[200],
    },
    midiasBlock: {
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[800]
        : "#FFFFFF",
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    siteName: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular,
      fontSize: 12,
      flex: 1,
    },
    midiasRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    blockBtnData: {
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[200],
    },
    card: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginTop: 16,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[800]
        : "#FFFFFF",
    },
    cardTitle: {
      marginBottom: 8,
      color: theme.colors.text,
      fontSize: 14,
      fontFamily: theme.fonts.extraBold,
      textTransform: "uppercase",
    },
    cardDesc: {
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
    cardList: {
      borderTopWidth: 1,
      borderColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[200],
    },
    dataBlock: {
      /*  borderBottomWidth: 1,
      borderColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[200], */
      // paddingTop: 10,
      paddingVertical: 16,
    },
    progressTitle: {
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      marginBottom: 4,
    },
    progress: {
      borderRadius: 100,
      height: 10,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[100],
      overflow: "hidden",
      position: "relative",
    },
    progressFill: {
      height: 10,
      backgroundColor: "#0FCBCC",
      position: "absolute",
    },
    valueContent: {
      height: 38,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      justifyContent: "space-between",
    },
    valueTitle: {
      color: "#fff",
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
    value: {
      color: "#fff",
      fontSize: 12,
      fontFamily: theme.fonts.bold,
    },
    dataRow: {
      marginTop: 16,
      flexDirection: "row",
      gap: 8,
    },
    dataItem: {
      borderRadius: 8,
      flex: 1,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[900]
        : "transparent",
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
      alignItems: "center",
      justifyContent: "center",
      height: 60,
      padding: 4,
    },
    dataTitle: {
      fontFamily: theme.fonts.regular,
      fontSize: 12,
      color: theme.colors.text,
    },
    dataValue: {
      fontFamily: theme.fonts.extraBold,
      fontSize: 14,
      color: theme.colors.text,
      textTransform: "capitalize",
      textAlign: "center",
    },
    warnBlock: {
      padding: 16,
    },
    warn: {
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[800]
        : "#FFFFFF",
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
      borderRadius: 8,
    },
    warnTxt: {
      color: theme.customColors.primary.default,
      fontFamily: theme.fonts.bold,
      fontSize: 12,
    },
    imagesRow: {
      flexGrow: 1,
      gap: 16,
      paddingHorizontal: 16,
    },
    imgBlock: {
      flexDirection: "row",
      gap: 12,
      borderRadius: 4,
      overflow: "hidden",
    },
    memberContainer: { gap: 8 },
    memberName: {
      fontFamily: theme.fonts.bold,
      fontSize: 12,
      lineHeight: 12,
      color: theme.colors.text,
    },
    memberDesc: {
      fontFamily: theme.fonts.regular,
      fontSize: 12,
      lineHeight: 12,
      color: theme.customColors.neutrals[500],
    },
    playIcon: {
      position: "absolute",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
