import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      paddingBottom: 16,
      borderBottomWidth: 1,
      marginBottom: 16,
      borderColor: theme.dark ? theme.customColors.neutrals[800] : theme.customColors.neutrals[100],
    },
    content: {
      padding: 16,
    },
    title: {
      color: theme.customColors.baseWhite,
      fontSize: 28,
      fontFamily: theme.fonts.bold,
      textAlign: 'center',
    },
    desc: {
      fontFamily: theme.fonts.regular,
      fontSize: 14,
      lineHeight: 21,
      color: theme.customColors.baseWhite,
      marginVertical: 18,
      flex: 1,
    },
    row: {
      flexDirection: 'row',
    },
  });
};
