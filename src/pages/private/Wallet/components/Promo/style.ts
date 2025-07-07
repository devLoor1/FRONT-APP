import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      // paddingVertical: 24,
      // paddingHorizontal: 16,
      //       padding: 24px 16px;
      //   border-top-width: 1px;
      //   border-bottom-width: 1px;
      //   border-color: #ffffff1a;
      //   margin-top: 34px;
    },
    content: {
      marginBottom: 24,
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#FFFFFF',
      borderRadius: 8,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
      overflow: 'hidden',
    },
    blockTxt: {
      padding: 18,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.fonts.extraBold,
      fontSize: 32,
    },
    star: {
      fontFamily: theme.fonts.extraBold,
      color: theme.customColors.error.default,
      fontSize: 20,
    },
    desc: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular,
      fontSize: 14,
      lineHeight: 18,
      maxWidth: 320,
    },
    validity: {
      color: theme.customColors.hyperlink,
      fontFamily: theme.fonts.regular,
      fontSize: 10,
      marginTop: 6,
      marginBottom: 20,
    },
    cashback: {
      fontSize: 8,
      color: theme.customColors.hyperlink,
      fontFamily: theme.fonts.regular,
      marginBottom: 20,
    },
  });
};
