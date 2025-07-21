import { useTheme } from "@/context/MyThemeContext";
import { StyleSheet } from "react-native";

const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: { flex: 1, gap: 16 },
    radioContainer: { gap: 8 },
    title: { fontFamily: theme.fonts.semiBold },
    radioItemContainer: {
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: theme.customColors.neutrals[100],
    },
    radio: {
      flexDirection: "row-reverse",
      gap: 16,
      paddingVertical: 10,
    },
    radioLabel: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 12,
      lineHeight: 18,
    },
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
};

export default useCustomStyles;
