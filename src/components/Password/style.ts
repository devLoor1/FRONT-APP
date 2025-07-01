import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    blockRequests: {
      marginTop: 26,
    },
    requestsTitle: {
      fontSize: 14,
      marginBottom: 14,
      fontFamily: theme.fonts.bold,
      color: theme.customColors.desc,
    },
    textRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputText: {
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
  });
};
