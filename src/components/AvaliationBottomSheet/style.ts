import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      paddingVertical: 30,
      flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10
    },
    title: {
      fontSize: 28,
      fontFamily: theme.fonts.bold,
      color: '#0054A6',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      marginVertical: 25,
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
      width: '90%',
      textAlign: 'center',
      alignSelf: 'center'
    },
    bold: {
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
    },
    starsWrapper: {
      width: '100%',
    },

    starRating: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 25
    },
    star: {
      flex: 1,
      alignItems: 'center',
    },

    commentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    commentTitle: {
      fontSize: 17,
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
    },
    charCount: {
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
      fontSize: 14,
    },
    containerTextArea: {
      padding: 15,
      backgroundColor: "#EFEFEF",
      marginBottom: 30,
      borderRadius: 10
    },

    textArea: {
      backgroundColor: '#FFFFFF',
      padding: 12,
      fontSize: 14,
      color: '#000000', 
      borderWidth: 0,
      textAlignVertical: 'top',
    },

    bottomSheet: { 

    }
  
  });
};
