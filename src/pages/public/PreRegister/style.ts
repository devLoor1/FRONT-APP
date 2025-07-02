import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      flexGrow: 1,
      flex: 1,
    },
    arrow: {
      marginVertical: 20,
      marginHorizontal: 15
    },
    title: {
      fontSize: 44,
      fontFamily: theme?.fonts?.bold || 'NunitoSans_700Bold',
      color: theme?.navigation?.colors?.text || '#39393A',
      marginBottom: 24,
    },
    desc: {
      color: theme?.customColors?.desc || '#666666',
      fontSize: 18,
      lineHeight: 27,
      fontFamily: theme?.fonts?.regular || 'NunitoSans_400Regular',
    },
    subDesc: {
      color: theme?.navigation?.dark ? theme?.customColors?.neutrals?.[500] || '#6B6B6B' : theme?.customColors?.neutrals?.[400] || '#969595',
      fontSize: 12,
      lineHeight: 18,
      fontFamily: theme?.fonts?.semiBold || 'NunitoSans_600SemiBold',
      textAlign: 'left',
    },
    rowInputs: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 16,
    },
    descInput: {
      fontSize: 12,
      color: theme?.customColors?.desc || '#666666',
      fontFamily: theme?.fonts?.semiBold || 'NunitoSans_600SemiBold',
      marginBottom: 6,
    },
    pasteBlock: {
      position: 'absolute',
      right: 16,
      top: '50%',
      paddingVertical: 10,
      paddingHorizontal: 12,
      transform: [{ translateY: -22 }],
      borderRadius: 6,
      height: 36,
      justifyContent: 'center',
    },
    paste: {
      color: theme?.customColors?.hyperlink || '#007AFF',
      fontSize: 12,
      textAlign: 'right',
    },
    login: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 48,
    },
    loginTxt: {
      fontSize: 14,
      fontFamily: theme?.fonts?.semiBold || 'NunitoSans_600SemiBold',
      color: theme?.customColors?.desc || '#666666',
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
      marginTop: 10,
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
    change: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: 10,
    },
    changeTxt: {
      color: theme?.navigation?.colors?.text || '#39393A',
      fontFamily: theme?.fonts?.bold || 'NunitoSans_700Bold',
      fontSize: 14,
      marginLeft: 8,
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
