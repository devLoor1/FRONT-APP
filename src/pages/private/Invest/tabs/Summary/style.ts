import { useTheme } from "@/context/MyThemeContext";
import { StyleSheet } from "react-native";

export default function useCustomStyles() {
  const { theme } = useTheme();
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
      gap: 8,
    },
    accordionStyle: {
      backgroundColor: theme.customColors.neutrals[100],
      borderRadius: 12,
      overflow: "hidden",
      paddingVertical: 0,
      paddingRight: 16,
    },
    titleStyle: {
      fontSize: 14,
      color: theme.colors.text,
      fontFamily: theme.fonts.semiBold,
    },
    required: { color: theme.customColors.error.default },
    formRowContainer: { flexDirection: "row", gap: 8, flex: 1 },
    checkboxContainer: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
    },
    checkbox: {
      flexDirection: "row-reverse",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    checkboxLabelStyle: {
      flexGrow: 1,
      width: "100%",
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
    },
    loading: {
      zIndex: 999,
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
  });
}
