import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flexGrow: 1,
    },
    containerForm: {
      paddingHorizontal: 16,
      paddingBottom: 10,
    },
    title: {
      fontSize: 44,
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
      marginBottom: 48,
    },
    content: {
      paddingBottom: 16,
      flex: 1,
      paddingTop: 8
    },
    btnBackBlock: {
      marginTop: 10,
      marginLeft: 8
    },
    btnCancel: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      borderRadius: 40,
    },
    subDesc: {
      color: theme.dark ? theme.customColors.neutrals[500] : theme.customColors.neutrals[400],
      fontSize: 12,
      lineHeight: 18,
      fontFamily: theme.fonts.semiBold,
      textAlign: 'left',
      marginLeft: 5
    },
  });
};
