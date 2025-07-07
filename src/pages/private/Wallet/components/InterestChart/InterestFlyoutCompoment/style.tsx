import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      position: 'absolute',
      zIndex: 999,
      maxWidth: 250,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: theme?.customColors.neutrals[300],
      backgroundColor: theme?.dark ? theme?.customColors.neutrals[800] : '#FFFFFF',
    },
    title: { fontFamily: theme?.fonts.bold, fontSize: 10, color: theme?.colors.text },
    description: { fontFamily: theme?.fonts.semiBold, fontSize: 10, color: theme?.colors.text },
    descriptionContainer: { flexDirection: 'row', alignItems: 'center' },
    itemValue: {
      color: theme?.customColors.risk.default,
      fontSize: 12,
      fontFamily: theme?.fonts.semiBold,
    },
  });
};
