import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      backgroundColor: theme.customColors.secondary.default,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    photo: {
      width: 52,
      height: 52,
      borderRadius: 52,
      backgroundColor: theme.customColors.baseBlack,
      borderWidth: 1,
      borderColor: theme.customColors.baseWhite,
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 16,
    },
    options: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
  });
};
