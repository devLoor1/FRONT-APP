import { StyleSheet } from "react-native";
import { useTheme } from "@/context/MyThemeContext";

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    card: {
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[800]
        : theme.customColors.neutrals[100],
      padding: 16,
      borderRadius: 8,
      gap: 16,
    },
    cardWhite: {
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : "#fff",
      borderRadius: 8,
      padding: 16,
      gap: 16,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
    },
    modality: {
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
      textTransform: "capitalize",
    },
    title: {
      fontSize: 18,
      fontFamily: theme.fonts.extraBold,
      color: theme.colors.text,
      marginBottom: -8,
      flex: 1,
      flexWrap: "wrap",
    },
    header: {
      gap: 16,
      flexDirection: "row",
      alignItems: "center",
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
      backgroundColor: theme.customColors.secondary.default,
      borderRadius: 100,
      position: "absolute",
      inset: 0,
    },
    legendContainer: {
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    },
    legendTitleContainer: {
      flex: 1,
      gap: 4,
      flexDirection: "row",
      alignItems: "center",
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 12,
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
    riskContainer: {
      // minWidth: 48,
      justifyContent: "center",
    },
    riskValue: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      color: theme.customColors.primary.default,
      textAlign: "center",
    },
    tags: {
      paddingHorizontal: 16,
    },
    icons: {
      flexDirection: "row",
      minWidth: 64,
      gap: 8,
    },
    type: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
    },
    typeText: {
      fontSize: 10,
      fontFamily: theme.fonts.semiBold,
      color: theme.customColors.baseWhite,
    },
    content: {
      // flexDirection: 'row',
      justifyContent: "space-between",
      // paddingTop: 16,
      // borderTopColor: theme.dark
      //   ? theme.customColors.neutrals[700]
      //   : theme.customColors.neutrals[200],
      // borderTopWidth: 1,
      gap: 16,
    },
    item: {
      flexDirection: "row",
      // flexBasis: '33.33%',
      flexGrow: 0,
      flexShrink: 0,
      justifyContent: "space-between",
      alignItems: "center",
    },
    itemBorderRight: {
      borderRightWidth: 1,
      borderRightColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[200],
    },
    itemContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
    itemTitle: {
      fontSize: 10,
      color: theme.dark
        ? theme.customColors.neutrals[400]
        : theme.customColors.neutrals[500],
      fontFamily: theme.fonts.semiBold,
    },
    itemValue: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
      textAlign: "center",
    },
    footer: {
      gap: 16,
      flexDirection: "row",
    },
    buttonRight: {
      flexDirection: "row-reverse",
      borderWidth: 0,
      backgroundColor: "transparent",
      height: 36,
    },
    buttonRightLabel: { color: theme.colors.text },
    buttonLeft: {
      paddingHorizontal: 24,
      height: 36,
    },
    favoriteContainer: {
      flex: 1,
      alignItems: "flex-end",
      marginRight: -12,
    },

    logo: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: theme.customColors.neutrals.default,
    },

    container: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: theme.customColors.neutrals.default,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
  });
};
