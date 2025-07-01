import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    card: {
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[800]
        : theme.customColors.neutrals[100],
      padding: 16,
      borderRadius: 8,
      gap: 16,
    },
    cardWhite: {
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#fff',
      borderRadius: 8,
      padding: 16,
      gap: 16,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
    },
    title: {
      fontSize: 18,
      fontFamily: theme.fonts.extraBold,
      color: theme.colors.text,
      marginBottom: -8,
      flex: 1,
      flexWrap: 'wrap',
    },
    header: {
      gap: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    riskContainer: {
      // minWidth: 48,
      justifyContent: 'center',
    },
    riskValue: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      color: theme.customColors.primary.default,
      textAlign: 'center',
    },
    tags: {
      paddingHorizontal: 16,
    },
    icons: {
      flexDirection: 'row',
      minWidth: 64,
      gap: 8,
    },
    type: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    typeText: {
      fontSize: 10,
      fontFamily: theme.fonts.semiBold,
      color: theme.customColors.baseWhite,
    },
    content: {
      // flexDirection: 'row',
      justifyContent: 'space-between',
      // paddingTop: 16,
      // borderTopColor: theme.dark
      //   ? theme.customColors.neutrals[700]
      //   : theme.customColors.neutrals[200],
      // borderTopWidth: 1,
      gap: 8,
    },
    item: {
      flexDirection: 'row',
      // flexBasis: '33.33%',
      flexGrow: 0,
      flexShrink: 0,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemBorderRight: {
      borderRightWidth: 1,
      borderRightColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[200],
    },
    itemContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    itemTitle: {
      fontSize: 10,
      color: theme.dark ? theme.customColors.neutrals[400] : theme.customColors.neutrals[500],
      fontFamily: theme.fonts.bold,
    },
    itemValue: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
      textAlign: 'center',
    },
    footer: {
      gap: 16,
      flexDirection: 'row',
    },
    buttonRight: {
      flexDirection: 'row-reverse',
      borderWidth: 0,
      backgroundColor: 'transparent',
    },
    buttonRightLabel: { color: theme.colors.text },
    buttonLeft: {
      paddingHorizontal: 24,
    },
    favoriteContainer: {
      flex: 1,
      alignItems: 'flex-end',
      marginRight: -12,
    },

    logo: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: theme.customColors.neutrals.default,
    },

    container: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: theme.customColors.neutrals.default,
      marginRight: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
