import React from 'react';
// import { BlurView } from 'expo-blur';
import { useCommon } from '@/context/CommonContext';
import { StyleSheet, Text, View } from 'react-native';
import CommonMask from '@/helpers/masks';
import { useTheme } from '@/context/MyThemeContext';

type Props = {
  value: string;
  fSize?: number;
};

export default function BlurValues({ value, fSize }: Props) {
  const { showBalance } = useCommon();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    totRow: {
      flexDirection: 'row',
    },
    totValue: {
      color: theme.colors.text,
      fontSize: fSize || 18,
      fontFamily: theme.fonts.bold,
    },
  });

  return (
    <View style={styles.totRow}>
      <Text style={styles.totValue}>R$ </Text>
      <View>
        <Text style={styles.totValue}>{showBalance ? CommonMask.currency(value || '0') : '-'}</Text>
        {/* <BlurView
          intensity={showBalance ? 0 : Platform.OS === 'ios' ? 20 : 120}
          tint="dark"
          style={{
            position: 'absolute',
            width: '120%',
            height: '100%',
            backgroundColor: 'transparent',
            overflow: 'hidden',
            top: 0,
            left: -4,
            borderRadius: 4,
          }}
        /> */}
      </View>
    </View>
  );
}
