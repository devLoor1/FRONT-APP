import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useAddressStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    searchTxt: {
      fontSize: 12,
      fontFamily: theme.fonts.semiBold,
      color: theme.customColors.secondary[500],
    },
    searchCepBlock: {
      position: 'absolute',
      right: 16,
      top: 52,
    },
    row: {
      flexDirection: 'row',
      gap: 6,
    },
    warn: {
      color: theme.dark ? theme.customColors.neutrals[500] : theme.customColors.neutrals[400],
      marginTop: 16,
      fontSize: 12,
      fontFamily: theme.fonts.semiBold,
    },
  });
};
