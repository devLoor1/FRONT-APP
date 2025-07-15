import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      flexGrow: 1,
      // paddingTop: 40,
      paddingBottom: 16,
    },
    title: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 44,
      marginBottom: 24,
    },
  });
};
