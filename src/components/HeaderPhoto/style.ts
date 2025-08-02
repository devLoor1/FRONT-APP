import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';
import { EdgeInsets } from "react-native-safe-area-context";

export const useCustomStyles = (insets: EdgeInsets) => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      backgroundColor: theme.customColors.secondary.default,
      paddingTop: insets.top + 12,
      paddingBottom: 12,
      paddingHorizontal: 16,
    },
    content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    profileContainer: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    photo: {
      width: 42,
      height: 42,
      borderRadius: 42,
      backgroundColor: theme.customColors.baseBlack,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 16,
    },
    options: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
  });
};
