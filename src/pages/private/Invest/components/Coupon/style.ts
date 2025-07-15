import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      marginTop: -5,
      marginHorizontal: -16,
      marginBottom: 24,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.customColors.secondary[600],
    },
    headTitle: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 18,
    },
    btnClose: {
      backgroundColor: theme.customColors.baseWhite,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 24,
    },
    title: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
    },
    inputTitle: {
      marginBottom: 6,
      color: theme.dark ? theme.customColors.secondary[500] : theme.customColors.secondary[700],
      fontSize: 14,
      fontFamily: theme.fonts.bold,
    },
    pasteBlock: {
      position: 'absolute',
      right: 16,
      top: 12,
    },
    paste: {
      color: theme.dark ? theme.colors.text : theme.customColors.secondary[700],
      fontSize: 12,
      textAlign: 'right',
    },
    card: {
      padding: 8,
      paddingTop: 0,
      backgroundColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
      borderRadius: 8,
    },
    cardItem: {
      flexDirection: 'row',
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#FFFFFF',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    couponName: {
      marginBottom: 4,
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
      fontSize: 14,
      textTransform: 'uppercase',
    },
    validBlock: {
      backgroundColor: theme.dark ? theme.customColors.neutrals[600] : theme.customColors.baseWhite,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
    },
    valid: {
      fontSize: 10,
      fontFamily: theme.fonts.semiBold,
      color: theme.colors.text,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 20,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fillRadio: {
      width: 10,
      height: 10,
      borderRadius: 10,
      backgroundColor: theme.colors.text,
    },
    rules: {
      marginTop: 16,
    },
    rulesHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    rulesTitle: {
      color: theme.colors.text,
      fontSize: 14,
      fontFamily: theme.fonts.bold,
    },
    rulesDesc: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular,
      fontSize: 12,
      marginTop: 8,
    },
  });
};
