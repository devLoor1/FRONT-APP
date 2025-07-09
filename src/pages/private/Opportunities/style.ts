import { StyleSheet } from "react-native";
import { useTheme } from "@/context/MyThemeContext";

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      flex: 1,
    },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      marginBottom: 24,
      fontFamily: theme.fonts.bold,
    },
    line: {
      height: 1,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[100],
      marginBottom: 24,
      marginHorizontal: -16,
    },
    actionsContainer: {
      gap: 8,
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 16,
    },
    searchInput: {
      flex: 1,
      height: 42,
      backgroundColor: theme.dark ? theme.customColors.inputBg : "#fff",
      borderColor: theme.customColors.neutrals[100],
      borderWidth: theme.dark ? 0 : 1,
      borderRadius: 10,
      padding: 0,
      textAlignVertical: "center",
      fontSize: 14,
      fontFamily: theme.fonts.bold,
    },
    filterItem: {
      width: 42,
      height: 42,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: theme.dark ? "#FFFFFF" : theme.customColors.neutrals.default,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[1000]
        : "#FFFFFF",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyText: {
      color: theme.colors.text,
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      marginBottom: 8,
      textAlign: "center",
    },
  });
};
