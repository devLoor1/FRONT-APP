import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      flexGrow: 1,
      flex: 1,
      justifyContent: 'center',
      paddingTop: 24,
    },
    logo: {
      marginBottom: 67,
      alignItems: 'center',
    },
    forgot: {
      marginLeft: 'auto',
      fontFamily: theme.fonts.semiBold,
      marginBottom: 80,
      padding: 5,
    },
    forgotTxt: {
      color: theme.customColors.hyperlink,
      fontSize: 12,
      fontFamily: theme.fonts.semiBold,
    },
    register: {
      flexDirection: 'row',
      marginHorizontal: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    registerTxt: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.customColors.hyperlink,
    },
    version: {
      fontSize: 10,
      fontFamily: theme.fonts.regular,
      color: theme.dark ? theme.customColors.neutrals[500] : theme.customColors.baseBlack,
      textAlign: 'center',
      marginBottom: 20,
      marginTop: 12,
    },
  });
};
