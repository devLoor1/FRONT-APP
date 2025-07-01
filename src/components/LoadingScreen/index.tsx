import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import LogoDark from '@/../assets/newSvgs/LogoEscuro.svg';
import Logo from '@/../assets/newSvgs/LogoClaro.svg';
import { styles } from './style';
import { useTheme } from '@/context/MyThemeContext';

export default function LoadingScreen() {
  const { theme } = useTheme();

  return (
    <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
      {theme.dark ? <Logo /> : <LogoDark />}
      <ActivityIndicator
        size="large"
        color={theme.customColors.secondary.default}
        style={{ marginTop: 24 }}
      />
    </View>
  );
}
