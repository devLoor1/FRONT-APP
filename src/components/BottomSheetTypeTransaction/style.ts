import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';
import { Platform } from 'react-native';

export const useCustomStyles = () => {
  const { theme } = useTheme();
  const { width } = Dimensions.get('screen');

  return StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: Platform.OS === 'ios' ? -35 : 0,
    },
    header: {
      marginTop: -5,
      paddingVertical: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.customColors.secondary[600],
    },
    title: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 20,
    },
    btnClose: {
      backgroundColor: theme.customColors.baseWhite,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5,
    },

    filterSubtitle: {
      color: theme.dark ? '#FFF' : theme.customColors.secondary.default,
      fontFamily: theme.fonts.bold,
      fontSize: 18,
      marginBottom: 16,
    },
    content: {
      backgroundColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite,
      flex: 1,
      width: width,
      alignSelf: 'center',
      paddingHorizontal: 16,
      justifyContent: 'space-between',
    },
    filterBox: {
      flexGrow: 1,
      marginBottom: 30,
      gap: 8,
    },
    filterItem: {
      width: 'auto',
      backgroundColor: '#FFF',
      borderRadius: 100,
      paddingHorizontal: 16,
      paddingVertical: 8,
      alignSelf: 'flex-start',
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterItemSelected: {
      backgroundColor: theme.customColors.secondary.default,
    },
    filterItemText: {
      fontSize: 14,
      color: theme.customColors.baseBlack,
    },
    filterItemTextSelected: {
      fontFamily: theme.fonts.bold,
      color: theme.customColors.baseWhite,
    },
    button: {
      flex: 1,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingBottom: 24,
      gap: 8,
    },
  });
};
