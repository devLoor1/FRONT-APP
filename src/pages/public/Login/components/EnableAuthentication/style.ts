import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    enableIcon: {
      alignItems: 'center',
      marginTop: 26,
    },
    enableTxt: {
      color: theme.customColors.baseWhite,
      textAlign: 'center',
      fontFamily: theme.fonts.bold,
      fontSize: 16,
      maxWidth: 250,
      marginHorizontal: 'auto',
      marginBottom: 26,
      marginTop: 24,
    },
    enableBtn: {
      borderWidth: 1,
      borderColor: theme.customColors.secondary.default,
      backgroundColor: theme.customColors.baseWhite,
      flexDirection: 'row',
      maxWidth: 286,
      marginHorizontal: 'auto',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      height: 45,
      borderRadius: 100,
      marginBottom: 8,
    },
    enableBtnTxt: {
      color: theme.customColors.secondary.default,
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
      marginLeft: 12,
    },
    disableBtn: {
      maxWidth: 286,
      marginHorizontal: 'auto',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
    },
    disableBtnTxt: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.regular,
      fontSize: 12,
    },
  });
};
