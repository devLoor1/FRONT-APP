import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    group: {
      marginBottom: 5,
    },
    desc: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
      color: theme.dark ? theme.customColors.neutrals[400] : theme.customColors.neutrals[700],
      marginBottom: 6,
    },
    item: {
      flexDirection: 'row',
      height: 55,
      marginTop: 8,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: 'center',
      width: '100%',
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 20,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fillRadio: {
      width: 10,
      height: 10,
      borderRadius: 10,
      backgroundColor: theme.customColors.baseWhite,
    },
    label: {
      marginLeft: 8,
      fontFamily: theme.fonts.semiBold,
      fontSize: 12,
      flex: 1,
    },
  });
};
