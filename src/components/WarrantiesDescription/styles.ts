import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
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
    typeDark: {
      backgroundColor: theme.dark ? theme.customColors.baseWhite : theme.customColors.neutrals[900],
    },
    typeText: {
      fontFamily: theme.fonts.semiBold,
      color: theme.customColors.baseWhite,
    },
    typeTextDark: {
      color: theme.dark ? theme.customColors.baseBlack : theme.customColors.baseWhite,
    },
  });
};
