import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';
import { EdgeInsets } from "react-native-safe-area-context";

export const useCustomStyles = (insets: EdgeInsets) => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: insets.top + 12,
      paddingBottom: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      backgroundColor: theme.customColors.secondary.default,
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
    title: {
      fontSize: 18,
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
    },
    iconList: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'flex-end',
      gap: 16,
    },
  });
};
