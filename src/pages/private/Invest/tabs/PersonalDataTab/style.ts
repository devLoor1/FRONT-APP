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
    checkbox: {
      flexDirection: "row-reverse",
      justifyContent: "flex-start",
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    checkboxLabelStyle: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
    },
  });
}
