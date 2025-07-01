import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    close: {
      width: 40,
      height: 40,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 48,
      backgroundColor: theme.customColors.neutrals[700],
      marginLeft: 'auto',
      marginTop: 8,
    },
    content: {
      maxWidth: 330,
      marginHorizontal: 'auto',
    },
    title: {
      color: theme.customColors.baseWhite,
      fontSize: 28,
      fontFamily: theme.fonts.bold,
      textAlign: 'center',
      marginBottom: 16,
    },
    desc: {
      color: theme.customColors.baseWhite,
      fontSize: 18,
      fontFamily: theme.fonts.regular,
      textAlign: 'center',
      marginBottom: 36,
    },
    codeCall: {
      color: theme.customColors.baseWhite,
      fontSize: 14,
      fontFamily: theme.fonts.bold,
      textAlign: 'center',
      marginBottom: 8,
    },
    codeBlock: {
      borderWidth: 2,
      borderColor: theme.customColors.baseWhite,
      borderRadius: 100,
      padding: 10,
      borderStyle: 'dashed',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
      marginBottom: 36,
    },
    code: {
      color: theme.customColors.baseWhite,
      fontSize: 28,
      fontFamily: theme.fonts.bold,
    },
    btn: {
      backgroundColor: theme.customColors.secondary.default,
      height: 44,
      borderRadius: 100,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginBottom: 36,
    },
    btnTxt: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
    },
    footerTxt: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.regular,
      fontSize: 12,
      textAlign: 'center',
    },
  });
};
