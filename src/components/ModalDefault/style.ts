import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    modal: {
      maxWidth: 384,
      minWidth: '80%',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: 8,
      paddingHorizontal: 12,
    },
    container: {
      borderRadius: 8,
      backgroundColor: theme.dark
        ? theme.customColors.neutrals[700]
        : theme.customColors.neutrals[100],
      overflow: 'hidden',
    },
    header: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.customColors.secondary[600],
    },
    headTitle: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 14,
    },
    btnClose: {
      backgroundColor: theme.customColors.baseWhite,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      padding: 16,
    },
    desc: {
      color: theme.colors.text,
      fontSize: 12,
      lineHeight: 18,
      fontFamily: theme.fonts.regular,
    },
  });
};
