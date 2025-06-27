import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      flexGrow: 1,
      flex: 1,
    },
    arrow: {
      marginVertical: 20,
      marginHorizontal: 15
    },
    title: {
      fontSize: 44,
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
      marginBottom: 24,
    },
    desc: {
      color: theme.customColors.desc,
      fontSize: 18,
      lineHeight: 27,
      fontFamily: theme.fonts.regular,
    },
    subDesc: {
      color: theme.dark ? theme.customColors.neutrals[500] : theme.customColors.neutrals[400],
      fontSize: 12,
      lineHeight: 18,
      fontFamily: theme.fonts.semiBold,
      textAlign: 'left',
    },
    rowInputs: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 40,
    },
    descInput: {
      fontSize: 12,
      color: theme.customColors.desc,
      fontFamily: theme.fonts.semiBold,
      marginBottom: 6,
    },
    pasteBlock: {
      position: 'absolute',
      right: 16,
      top: '50%',
      paddingVertical: 10,
      paddingHorizontal: 12,
      transform: [{ translateY: -22 }],
      borderRadius: 6,
      height: 36,
      justifyContent: 'center',
    },
    paste: {
      color: theme.customColors.hyperlink,
      fontSize: 12,
      textAlign: 'right',
    },
    login: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 48,
    },
    loginTxt: {
      fontSize: 14,
      fontFamily: theme.fonts.semiBold,
      color: theme.customColors.desc,
    },
    cell: {
      backgroundColor: theme.customColors.inputBg,
      borderRadius: 12,
    },
    focusCell: {},
    cellTxt: {
      fontSize: 20,
      textAlign: 'center',
      height: 55,
      width: 44,
      lineHeight: 55,
      fontFamily: theme.fonts.bold,
      color: theme.customColors.desc,
    },
    sendAgainRow: {
      flexDirection: 'row',
      marginTop: 10,
    },
    timer: {
      color: theme.customColors.desc,
      fontSize: 14,
      fontFamily: theme.fonts.semiBold,
    },
    sendAgainTxt: {
      color: theme.customColors.hyperlink,
      fontSize: 14,
      fontFamily: theme.fonts.semiBold,
    },
    change: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: 10,
    },
    changeTxt: {
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
      fontSize: 14,
      marginLeft: 8,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
  });
};
