import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      flex: 1,
    },
    title: {
      color: theme?.navigation?.colors?.text || '#39393A',
      fontFamily: theme?.fonts?.bold || 'NunitoSans_700Bold',
      fontSize: 44,
      marginBottom: 24,
    },
    desc: {
      color: theme?.customColors?.desc || '#666666',
      fontFamily: theme?.fonts?.regular || 'NunitoSans_400Regular',
      fontSize: 18,
      marginBottom: 48,
      lineHeight: 27,
    },
    footer: {
      gap: 8,
      marginBottom: 10,
    },
    cell: {
      backgroundColor: theme?.customColors?.inputBg || '#EFEFEF',
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
      color: theme?.customColors?.desc || '#666666',
    },
    sendAgainRow: {
      flexDirection: 'row',
      marginTop: 6,
    },
    timer: {
      color: theme?.customColors?.desc || '#666666',
      fontSize: 14,
      fontFamily: theme?.fonts?.semiBold || 'NunitoSans_600SemiBold',
    },
    sendAgainTxt: {
      color: theme?.customColors?.hyperlink || '#007AFF',
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
