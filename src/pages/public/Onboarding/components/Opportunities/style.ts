import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../../context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    title: {
      marginBottom: 24,
      lineHeight: 52,
      fontFamily: theme.fonts.bold,
      fontSize: 44,
      color: theme.colors.text,
    },
    footer: {
      marginHorizontal: -16,
      padding: 16,
      backgroundColor: theme.customColors.secondary[600],
    },
    footerTitle: {
      textAlign: 'center',
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 28,
    },
    buttons: {
      marginTop: 16,
      marginBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonLeft: {
      flexGrow: 1,
      marginRight: 8,
    },
    buttonRight: {
      flexGrow: 1,
      marginLeft: 8,
    },
    card: {
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[800]
        : theme.customColors.neutrals[100],
      padding: 16,
      marginBottom: 16,
      borderRadius: 8,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[200],
    },
    cardTitle: {
      fontSize: 14,
      fontFamily: theme.fonts.extraBold,
      textTransform: 'uppercase',
      color: theme.colors.text,
      marginBottom: 4,
    },
    cardHeader: {
      marginBottom: 16,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    riskContainer: {
      minWidth: 48,
      justifyContent: 'center',
    },
    icons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      minWidth: 64,
      gap: 8,
    },
    type: {
      padding: 4,
      borderRadius: 4,
    },
    typeText: {
      fontSize: 10,
      textTransform: 'uppercase',
      fontFamily: theme.fonts.semiBold,
    },
    content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 16,
      borderTopColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[200],
      borderTopWidth: 1,
    },
    item: {
      flexBasis: '33.33%',
      flexGrow: 0,
      flexShrink: 0,
      alignItems: 'center',
    },
    itemBorderRight: {
      borderRightWidth: 1,
      borderRightColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[200],
    },
    itemTitle: {
      fontSize: 10,
      color: theme.dark ? theme.customColors.neutrals[400] : theme.customColors.neutrals[500],
      fontFamily: theme.fonts.bold,
      marginBottom: 6,
    },
    itemValue: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
      textAlign: 'center',
    },
  });
};
