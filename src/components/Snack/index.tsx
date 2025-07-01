/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useAppDispatch } from '../../redux/hooks';
import { useTheme } from '@/context/MyThemeContext';

type BackPageType = {
  txt: string | null;
  visible: boolean;
  setShowSnack: React.Dispatch<React.SetStateAction<boolean>>;
  reset?: () => any;
  duration?: number;
  type?: 'warning' | 'error' | 'information';
};

export default function Snack({
  txt,
  visible,
  reset,
  setShowSnack,
  duration,
  type = 'error',
}: BackPageType) {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      backgroundColor:
        type === 'error'
          ? theme.customColors.error[300]
          : type === 'information'
          ? theme.customColors.secondary[500]
          : theme.customColors.warning.default,
      marginHorizontal: 'auto',
    },
    txt: {
      textAlign: 'center',
      color: type === 'warning' ? theme.customColors.baseBlack : theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 16,
    },
  });

  function onDismissSnackBar() {
    if (reset) {
      dispatch(reset());
    }
    setShowSnack(false);
  }

  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={duration || 3000}
        style={styles.container}>
        <Text style={styles.txt}>{txt}</Text>
      </Snackbar>
    </View>
  );
}
