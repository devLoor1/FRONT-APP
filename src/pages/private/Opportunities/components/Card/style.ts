import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    cardBlock: {
      marginBottom: 12,
    },
    card: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#fff',
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
      overflow: 'hidden',
      gap: 16,
    },
    img: {
      width: 49,
      height: 49,
      borderRadius: 49,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[100],
      overflow: 'hidden',
    },
    name: {
      color: theme.colors.text,
      fontSize: 14,
      fontFamily: theme.fonts.extraBold,
      textTransform: 'uppercase',
    },
    sector: {
      fontSize: 10,
      fontFamily: theme.fonts.semiBold,
      color: theme.customColors.neutrals[400],
    },
    codesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
    codeText: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      color: theme.dark ? theme.customColors.baseWhite : theme.customColors.baseBlack,
    },
    code: {
      minWidth: 96,
      height: 26,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    codeTxt: {
      color: theme.customColors.baseWhite,
      fontSize: 12,
      fontFamily: theme.fonts.bold,
    },
    tags: {
      paddingHorizontal: 16,
    },
    tag: {
      height: 21,
      width: 90,
      borderRadius: 4,
      backgroundColor: '#54B0FE',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagTxt: {
      textTransform: 'uppercase',
      fontSize: 10,
      fontFamily: theme.fonts.regular,
      color: theme.customColors.baseWhite,
    },
    risk: {
      fontFamily: theme.fonts.bold,
      fontSize: 12,
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
    icons: {
      flexDirection: 'row',
      gap: 8,
    },
    listBlock: {
      gap: 12,
    },
    itemData: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
    },
    dataTitle: {
      fontSize: 10,
      color: theme.customColors.neutrals[400],
      fontFamily: theme.fonts.semiBold,
    },
    dataDesc: {
      fontSize: 12,
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
    },
    valueBlock: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.neutrals[200],
      gap: 12,
      paddingVertical: 12,
    },
    valueContent: {
      height: 38,
      borderRadius: 8,
      backgroundColor: theme.customColors.secondary[500],
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      justifyContent: 'space-between',
    },
    valueTitle: {
      color: '#fff',
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
    value: {
      color: '#fff',
      fontSize: 12,
      fontFamily: theme.fonts.bold,
    },
    progressTitle: {
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      marginBottom: 4,
    },
    progress: {
      borderRadius: 100,
      height: 10,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[100],
      overflow: 'hidden',
    },
    progressFill: {
      height: 10,
      backgroundColor: theme.customColors.secondary.default,
      borderRadius: 100,
    },
    footer: {
      flexDirection: 'row',
      gap: 16,
    },
    buttonRight: {
      alignSelf: 'flex-start',
      flexDirection: 'row-reverse',
      borderWidth: 0,
      backgroundColor: 'transparent',
    },
    buttonRightLabel: { color: theme.colors.text },
  });
};
