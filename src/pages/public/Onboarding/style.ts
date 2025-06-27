import { StyleSheet } from 'react-native';
import { useTheme } from '../../../context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      position: 'relative',
      padding: 16,
      paddingBottom: 0,
      flex: 1,
    },
    backgroundImage: {
      width: 393,
      height: 496,
      position: 'absolute',
      bottom: 0,
    },
    title: {
      lineHeight: 50,
      paddingTop: 16,
      marginBottom: 16,
      textAlign: 'left',
      fontFamily: theme.fonts.bold,
      fontSize: 60,
      color: theme.colors.text,
    },
    description: {
      fontSize: 18,
      marginBottom: 32,
      fontFamily: theme.fonts.regular,
      color: theme.customColors.desc,
    },
    highlight: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.customColors.desc,
    },
    title2: {
      lineHeight: 52,
      marginTop: 16,
      marginBottom: 16,
      textAlign: 'center',
      fontFamily: theme.fonts.bold,
      fontSize: 44,
      color: theme.colors.text,
    },
    image: {
      width: '100%',
      height: '50%',
      resizeMode: 'contain',
      marginVertical: 20,
    },
    nextButton: {
      zIndex: 10,
      position: 'absolute',
      bottom: 26,
      right: 16,
    },
  });
};
