import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      flexGrow: 1,
      paddingTop: 40,
    },
    title: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 44,
      marginBottom: 24,
    },
    desc: {
      color: theme.customColors.neutrals[200],
      fontFamily: theme.fonts.regular,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 70,
    },
    footer: {
      marginBottom: 10,
    },
  });
};
