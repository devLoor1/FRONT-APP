import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      flex: 1,
    },
    borderBottom: {
      borderBottomWidth: 1,
      marginTop: 24,
      borderColor: theme.dark ? theme.customColors.neutrals[800] : theme.customColors.neutrals[100],
    },
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 24,
    },
    photo: {
      width: 42,
      height: 42,
      borderRadius: 42,
      backgroundColor: theme.customColors.baseBlack,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headName: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
      marginBottom: 4,
    },
    headDoc: {
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
    },
    card: {
      marginBottom: 8,
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#FFF',
      borderRadius: 8,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
    },
    cardIcon: {
      width: 30,
    },
    cardTitle: {
      fontSize: 14,
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
      marginBottom: 4,
    },
    cardDesc: {
      fontSize: 12,
      lineHeight: 18,
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
    },
    btnExit: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 6,
      marginTop: 16,
    },
    btnExitTxt: {
      color: theme.dark ? theme.customColors.error.default : theme.customColors.error[300],
      fontSize: 12,
      fontFamily: theme.fonts.semiBold,
    },
    version: {
      fontSize: 10,
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
      textAlign: 'center',
      marginTop: 24,
    },
  });
};
