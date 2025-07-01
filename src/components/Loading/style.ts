import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = (transparent: boolean = false) => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: 100,
      backgroundColor: transparent ? 'transparent' : theme.colors.background,
    },
    txt: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular,
      marginTop: 12,
    },
  });
};
