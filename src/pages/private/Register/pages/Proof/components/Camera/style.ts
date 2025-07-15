import { StyleSheet } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';

export const usePageStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    arrow: {
      paddingHorizontal: 16,
      marginBottom: 18,
    },
    ui: {
      height: 140,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnTake: {
      width: 80,
      height: 80,
      borderRadius: 80,
      borderWidth: 4,
      borderColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnTakeFill: {
      width: 62,
      height: 62,
      backgroundColor: '#fff',
      borderRadius: 62,
    },
    confirmImg: {
      flex: 1,
    },
    confirmImgBody: {
      flex: 1,
      paddingBottom: 48,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    blockImg: {
      borderWidth: 4,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderColor: theme.customColors.neutrals[400],
      borderRadius: 16,
    },
    img: {
      width: 280,
      height: 400,
    },
    confirmImgTxt: {
      textAlign: 'center',
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      marginTop: 48,
    },
    confirmImgFooter: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    btnCancelBlock: {
      right: 16,
      top: 56,
      position: 'absolute',
    },
    btnCancel: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      width: 40,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 40,
    },
    progressContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    progressBar: {
      width: '60%',
      height: 30,
      borderRadius: 5,
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 200, 180, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressFill: {
      position: 'absolute',
      height: '100%',
      backgroundColor: theme.customColors.secondary.default,
      left: 0,
    },
    barValue: {
      marginRight: 8,
      fontFamily: theme.fonts.regular,
      fontSize: 12,
      lineHeight: 14,
      color: '#fff',
    },
  });
};
