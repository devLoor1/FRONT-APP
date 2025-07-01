import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    title: {
      color: theme?.customColors?.baseWhite || '#FFFFFF',
      textAlign: 'center',
      fontFamily: theme?.fonts?.bold || 'NunitoSans_700Bold',
      fontSize: 28,
      marginBottom: 24,
      marginTop: 40,
    },
    desc: {
      color: theme?.customColors?.baseWhite || '#FFFFFF',
      textAlign: 'center',
      fontFamily: theme?.fonts?.regular || 'NunitoSans_400Regular',
      fontSize: 14,
      marginHorizontal: 'auto',
      marginBottom: 24,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme?.navigation?.dark ? theme?.customColors?.neutrals?.[700] || '#404040' : theme?.customColors?.baseWhite || '#FFFFFF',
      borderRadius: 8,
      marginBottom: 16,
      gap: 16,
      height: 100,
    },
    optionDesc: {
      color: theme?.navigation?.colors?.text || '#39393A',
      fontSize: 14,
      fontFamily: theme?.fonts?.regular || 'NunitoSans_400Regular',
    },
    optionValue: {
      color: theme?.navigation?.colors?.text || '#39393A',
      fontSize: 14,
      fontFamily: theme?.fonts?.bold || 'NunitoSans_700Bold',
    },
    change: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    changeTxt: {
      color: theme?.customColors?.baseWhite || '#FFFFFF',
      fontFamily: theme?.fonts?.bold || 'NunitoSans_700Bold',
      fontSize: 14,
      marginLeft: 8,
    },
    cell: {
      backgroundColor: theme?.navigation?.dark ? theme?.customColors?.neutrals?.[700] || '#404040' : theme?.customColors?.baseWhite || '#FFFFFF',
      borderRadius: 12,
    },
    focusCell: {},
    cellTxt: {
      fontSize: 20,
      textAlign: 'center',
      height: 55,
      width: 44,
      lineHeight: 55,
      fontFamily: theme?.fonts?.bold || 'NunitoSans_700Bold',
      color: theme?.navigation?.dark ? theme?.customColors?.neutrals?.[200] || '#E0E0E0' : theme?.navigation?.colors?.text || '#39393A',
    },
    sendAgainRow: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 24,
    },
    timer: {
      color: theme?.customColors?.baseWhite || '#FFFFFF',
      fontSize: 14,
      fontFamily: theme?.fonts?.semiBold || 'NunitoSans_600SemiBold',
    },
    sendAgainTxt: {
      color: theme?.customColors?.baseWhite || '#FFFFFF',
      fontSize: 14,
      fontFamily: theme?.fonts?.semiBold || 'NunitoSans_600SemiBold',
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
  });
};
