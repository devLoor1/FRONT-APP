/* eslint-disable react-native/no-inline-styles */
import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from '../../context/MyThemeContext';

type Props = {
  index: number;
  qtd: number;
};

export default function Steps({ index, qtd }: Props) {
  const list = Array.from({ length: qtd }, (_value, index) => ++index);
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {list.map(step => (
        <View
          key={step}
          style={{
            ...styles.bar,
            flex: step === index ? 2 : 1,
            backgroundColor:
              step === index
                ? theme.dark
                  ? theme.customColors.neutrals[200]
                  : theme.customColors.baseBlack
                : theme.dark
                ? theme.customColors.neutrals[800]
                : '#38383A1A',
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 8, marginBottom: 24, marginTop: 16 },
  bar: { height: 8, borderRadius: 100 },
});
