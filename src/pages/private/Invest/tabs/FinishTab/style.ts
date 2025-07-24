import { useTheme } from "@/context/MyThemeContext";
import { StyleSheet } from "react-native";

export default function useCustomStyles() {
  const { theme } = useTheme();
  return StyleSheet.create({
    container: { flex: 1, paddingTop: 24 },
    error: { alignItems: "center", flex: 1 },
    body: { flex: 1, gap: 24, paddingHorizontal: 16 },
    header: { gap: 8 },
    congrats: { fontFamily: theme.fonts.bold, fontSize: 20 },
    title: { fontFamily: theme.fonts.bold },
    qrContainer: {
      borderRadius: 8,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    rowTitle: { fontFamily: theme.fonts.regular, fontSize: 12 },
    rowValue: { fontFamily: theme.fonts.bold },
    divider: { paddingVertical: 0 },
    footer: { padding: 16 },
  });
}
