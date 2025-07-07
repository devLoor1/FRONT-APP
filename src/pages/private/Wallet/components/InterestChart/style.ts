import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      marginBottom: 24,
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#FFFFFF',
      padding: 16,
      borderRadius: 8,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      marginRight: 8,
    },
    value: {
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: theme.fonts.bold,
    },
    itemContainer: {
      flexDirection: 'row', 
      justifyContent: 'flex-end', 
      alignItems: 'center'
    },
    itemTitle: {
      color: theme.colors.text,
      fontSize: 10,
      fontFamily: theme.fonts.regular,
      marginRight: 8,
    },
    itemValueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    itemValue: {
      color: theme.customColors.risk.default,
      fontSize: 12,
      fontFamily: theme.fonts.semiBold,
    },
    legend: { flexDirection: 'row', gap: 16, paddingHorizontal: 8 },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 14,
      paddingVertical: 4,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: theme.dark ? theme.customColors.neutrals[300] : theme.customColors.neutrals[200],
      backgroundColor: theme.dark ? theme.customColors.neutrals[900] : theme.colors.background,
    },
    labelDor: { width: 8, height: 8, borderRadius: 4 },
    labelText: { fontFamily: theme.fonts.regular, fontSize: 12, color: theme.colors.text },
  });
};
