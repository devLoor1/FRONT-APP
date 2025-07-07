import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    news: {
      paddingTop: 20,
      marginTop: 20,
      borderTopWidth: 1,
      borderColor: theme.dark ? theme.customColors.neutrals[800] : theme.customColors.neutrals[100],
    },
    newsContent: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 16,
    },
    item: {
      flex: 1,
      borderRadius: 8,
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#FFFFFF',
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
      overflow: 'hidden',
    },
    itemContent: {
      padding: 16,
    },
    itemImg: {
      height: 80,
      backgroundColor: theme.customColors.neutrals[600],
      borderRadius: 8,
      borderBottomEndRadius: 0,
      borderBottomStartRadius: 0,
    },
    itemTitle: {
      color: theme.dark ? theme.colors.text : theme.customColors.secondary.default,
      marginBottom: 10,
      fontFamily: theme.fonts.bold,
      fontSize: 16,
    },
    itemDesc: {
      color: theme.customColors.desc,
      fontFamily: theme.fonts.regular,
      fontSize: 12,
      maxWidth: 140,
    },
    itemMore: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginLeft: 'auto',
      marginTop: 10,
    },
    itemMoreTxt: {
      color: theme.colors.text,
      fontSize: 10,
      fontFamily: theme.fonts.semiBold,
    },
    moreTxt: {
      color: theme.customColors.hyperlink,
      textAlign: 'center',
      fontSize: 14,
      fontFamily: theme.fonts.regular,
    },
  });
};
