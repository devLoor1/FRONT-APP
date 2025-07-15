import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const usePageStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    desc: {
      color: theme.dark ? theme.customColors.neutrals[200] : theme.customColors.neutrals[700],
      marginBottom: 48,
      fontSize: 18,
      fontFamily: theme.fonts.regular,
    },
    list: {
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#fff',
      padding: 24,
      paddingBottom: 8,
      borderRadius: 12,
      marginBottom: 48,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 16,
    },
    listTxt: {
      fontFamily: theme.fonts.regular,
      flex: 1,
      fontSize: 14,
      color: theme.dark ? theme.customColors.neutrals[300] : theme.customColors.neutrals[700],
    },
    cardWarn: {
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#fff',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 12,
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
    },
    warnTitle: {
      color: theme.customColors.hyperlink,
      fontFamily: theme.fonts.bold,
      fontSize: 16,
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    warnDesc: {
      fontFamily: theme.fonts.regular,
      fontSize: 12,
      maxWidth: 220,
      color: theme.dark ? theme.customColors.neutrals[300] : theme.customColors.baseBlack,
    },
  });
};
