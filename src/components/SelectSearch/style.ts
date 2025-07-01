import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    option: {
      // width: '100%',
      // padding: 16,
    },
    optionTxt: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular,
      fontSize: 14,
    },
    input: {
      backgroundColor: theme.customColors.inputBg,
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
      width: '100%',
    },
    arrow: {
      position: 'absolute',
      right: 16,
      top: 24,
    },
    bottomSheetContainer: { flex: 1, paddingTop: 24, gap: 24 },
    title: {
      fontFamily: theme.fonts.bold,
      fontSize: 18,
      color: theme.colors.text,
    },
    search: {
      borderRadius: 12,
      borderColor: theme.colors.text,
      borderWidth: 1,
      shadowOpacity: 0,
      backgroundColor: theme.customColors.inputBg,
      height: 55,
      shadowColor: 'transparent',
    },
    searchInput: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular,
      shadowColor: 'transparent',
      fontSize: 14,
    },
    supportTxt: {
      marginLeft: 16,
      fontSize: 12,
      color: theme.colors.text,
    },
    labelContainer: {
      flexDirection: 'row',
    },
    label: {
      color: theme.dark ? theme.customColors.neutrals[400] : theme.customColors.neutrals[700],
      marginBottom: 6,
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
    },
  });
};
