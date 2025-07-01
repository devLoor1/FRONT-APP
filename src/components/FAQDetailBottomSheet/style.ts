import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';
import { EdgeInsets } from 'react-native-safe-area-context';

export const useCustomStyles = (insets: EdgeInsets) => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 16,
    },
    imageContainer: {
      marginTop: insets.top,
      position: 'relative',
      marginBottom: 16,
    },
    image: {
      height: 160,
      borderRadius: 8,
      marginLeft: -16,
      marginRight: -16,
    },
    btnClose: {
      backgroundColor: theme.customColors.baseBlack,
      position: 'absolute',
      top: 12,
      right: 0,
      zIndex: 10,
      borderRadius: 20,
    },
    contentContainer: {
      flexGrow: 1,
    },
    title: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.dark ? theme.customColors.secondary[500] : theme.customColors.secondary.default,
      marginBottom: 12,
    },
    description: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
      lineHeight: 21,
    },
  });
};