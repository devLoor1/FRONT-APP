import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type Props = {
  style?: ViewStyle;
  width?: number;
  height?: number;
  bgColor: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  children: React.ReactNode;
};

export default function BtnIcon({
  style,
  width = 38,
  height = 38,
  bgColor,
  onPress,
  children,
}: Props) {
  const styles = StyleSheet.create({
    btn: {
      width: width,
      height: height,
      backgroundColor: bgColor,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, style]}>
      {children}
    </TouchableOpacity>
  );
}
