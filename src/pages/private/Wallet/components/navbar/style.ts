import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      marginBottom: 24,
      marginTop: 8,
      gap: 16,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: theme.fonts.bold,
    },
    head: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    totTitle: {
      marginRight: 8,
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
    statement: {
      color: theme.dark ? theme.colors.text : theme.customColors.neutrals[400],
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      marginRight: 8,
    },
    promoBalanceContainer: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[800]
        : theme.customColors.neutrals[100],
    },
    promoBalanaceTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    promoBalanaceTitle: {
      fontFamily: theme.fonts.regular,
      fontSize: 10,
      lineHeight: 14,
      color: theme.colors.text,
    },
    promoBalanaceValue: {
      fontFamily: theme.fonts.bold,
      fontSize: 12,
      lineHeight: 18,
      color: theme.dark ? theme.customColors.secondary[600] : theme.customColors.secondary.default,
    },
    nav: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      flexGrow: 1,
      gap: 16,
      marginTop: 8,
    },
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
