import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    content: {
      paddingTop: 24,
      paddingHorizontal: 16,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.fonts.extraBold,
      fontSize: 14,
      textTransform: 'uppercase',
      marginBottom: 10,
    },
    subtitle: {
      color: theme.colors.text,
      fontFamily: theme.fonts.semiBold,
      fontSize: 12,
      marginBottom: 24,
    },
    card: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#FFFFFF',
      marginBottom: 24,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
    },
    cardTitle: {
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
      fontSize: 14,
      marginBottom: 4,
    },
    cardDesc: {
      color: theme.dark ? theme.customColors.neutrals[200] : theme.customColors.neutrals[500],
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
    cardBorder: {
      borderBottomWidth: 1,
      borderColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.neutrals[200],
      marginVertical: 8,
    },
    cardValue: {
      color: theme.dark ? theme.customColors.secondary[500] : theme.customColors.secondary.default,
      fontFamily: theme.fonts.bold,
      fontSize: 16,
    },
    cardItem: {
      color: theme.dark ? theme.customColors.neutrals[300] : theme.customColors.neutrals[500],
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
    about: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginBottom: 24,
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#FFFFFF',
    },
    aboutTxt: {
      fontFamily: theme.fonts.regular,
      fontSize: 12,
      color: theme.colors.text,
    },
    tabsHeader: {
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#FFFFFF',
      paddingVertical: 8,
    },
    tabTitleBlock: {
      height: 40,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    tabTitleTxt: {
      fontSize: 14,
      fontFamily: theme.fonts.semiBold,
      color: theme.colors.text,
    },
    tabContent: {
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
  });
};
