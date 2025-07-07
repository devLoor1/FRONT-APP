import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      marginBottom: 8,
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#FFFFFF',
      padding: 16,
      borderRadius: 8,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    head: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      marginRight: 8,
    },
    value: {
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: theme.fonts.bold,
    },
    list: {
      paddingVertical: 8,
      flexDirection: 'row',
      gap: 16,
      justifyContent: 'space-between',
    },
    itemTitle: {
      color: theme.colors.text,
      fontSize: 10,
      fontFamily: theme.fonts.regular,
      marginRight: 8,
    },
    itemValue: {
      color: '#168941',
      fontSize: 12,
      fontFamily: theme.fonts.semiBold,
    },
    totTitle: {
      marginRight: 8,
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
    totValue: {
      marginRight: 8,
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: theme.fonts.bold,
    },
    statement: {
      color: theme.dark ? theme.customColors.neutrals[500] : theme.customColors.neutrals[400],
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
  });
};
