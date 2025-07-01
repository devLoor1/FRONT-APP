import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useCustomStyles } from './style';
import { useTheme } from '@/context/MyThemeContext';

type LoadingType = {
  txt?: string;
  transparent?: boolean;
};

export default function LoadingComp({ txt, transparent = false }: LoadingType) {
  const { theme } = useTheme();
  const styles = useCustomStyles(transparent); 

  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.customColors.secondary.default} size="large" />
      {!!txt && <Text style={styles.txt}>{txt}</Text>}
    </View>
  );
}
