import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      marginHorizontal: -16,
      marginBottom: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.customColors.secondary[600],
    },
    title: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 18,
    },
    btnClose: {
      backgroundColor: theme.customColors.baseWhite,
      justifyContent: 'center',
      alignItems: 'center',
    },
    section: {
      marginBottom: 48,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      color: theme.dark ? theme.customColors.secondary[500] : theme.customColors.secondary.default,
      marginBottom: 16,
    },
    filterOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    filterSubOptions: {
      marginTop: -32,
      marginBottom: 48,
    },
    filterOption: {
      height: 36,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: '#FFF',
      paddingHorizontal: 16,
      borderRadius: 100,
    },
    filterOptionSelected: {
      backgroundColor: theme.colors.primary,
    },
    filterOptionText: {
      color: theme.customColors.baseBlack,
      fontFamily: theme.fonts.regular,
      fontSize: 14,
    },
    filterOptionTextSelected: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 14,
    },
    filterOptionIcon: {
      marginLeft: 4,
    },
    buttonWithIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      marginRight: 8,
      marginBottom: 8,
    },
    buttonTextWithIcon: {
      color: theme.customColors.baseWhite,
      marginLeft: 5, // Espaço entre o texto e o ícone
    },
    buttonContainer: {
      marginBottom: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    button: {
      flex: 1,
    },
  });
};
