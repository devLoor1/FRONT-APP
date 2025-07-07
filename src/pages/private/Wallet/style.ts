import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      padding: 16,
      flex: 1,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 8,
    },
    titleOpportunity: {
      color: theme.colors.text,
      fontSize: 16,
      fontFamily: theme.fonts.bold,
    },
    moreTxt: {
      color: theme.customColors.hyperlink,
      textAlign: 'center',
      fontSize: 14,
      fontFamily: theme.fonts.regular,
    },
    btnProfile: {
      backgroundColor: theme.customColors.secondary.default,
      height: 44,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      gap: 16,
      marginBottom: 16,
      marginTop: 24,
    },
    btnTxt: {
      fontSize: 14,
      fontFamily: theme.fonts.bold,
      color: theme.customColors.baseWhite,
      flex: 1,
    },
    btnIndicate: {
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : theme.customColors.baseBlack,
      height: 56,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      gap: 16,
    },
    btnIcon: {
      width: 24,
      alignItems: 'center',
    },
  });
};
