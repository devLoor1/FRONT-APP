import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    footer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '100%',
      marginTop: 8,
    },
    footerItem: {
      color: theme.dark ? theme.colors.text : theme.customColors.neutrals[300],
      opacity: 0.9,
      fontSize: 10,
      lineHeight: 12,
      fontFamily: theme.fonts.bold,
    },
    selectList: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // marginTop: 24,
      width: '100%',
    },
    selectItem: {
      width: 65,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: 'transparent',
    },
    selectTxt: {
      color: theme.colors.text,
      fontSize: 12,
      lineHeight: 14,
      fontFamily: theme.fonts.bold,
    },
    flyoutTitle: { fontFamily: theme.fonts.bold, fontSize: 10, color: theme.colors.text },
    flyoutDescription: { fontFamily: theme.fonts.semiBold, fontSize: 10, color: theme.colors.text },
  });
};
