import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      paddingVertical: 24,
      paddingHorizontal: 16,
      flex: 1,
    },
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 24,
    },
    headIcon: {
      width: 52,
      height: 52,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headName: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
      marginBottom: 4,
    },
    headDesc: {
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
    },
    instructionCard: {
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#FFF',
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
      padding: 16,
      borderRadius: 8,
      marginBottom: 24,
    },
    instructionText: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
    },
    instructionHighlight: {
      fontFamily: theme.fonts.bold,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
      marginBottom: 16,
    },
    infoCard: {
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#FFF',
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    infoText: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
    },
    boldText: {
      fontFamily: theme.fonts.bold,
    },
    footer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
  });
};
