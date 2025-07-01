import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    navIcon: {
      width: 54,
      height: 54,
      borderRadius: 54,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[800]
        : theme.customColors.neutrals[100],
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 'auto',
    },
    navTxt: {
      color: theme.colors.text,
      marginTop: 8,
      textAlign: 'center',
      fontSize: 10,
      lineHeight: 16,
      fontFamily: theme.fonts.regular,
    },
  });
};
