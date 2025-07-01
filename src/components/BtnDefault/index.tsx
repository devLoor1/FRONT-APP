import { GestureResponderEvent, StyleSheet, Text, TextStyle, TouchableOpacity } from 'react-native';
import React, { ReactNode } from 'react';
import { useTheme } from '@/context/MyThemeContext';

type Props = {
  label: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  white?: boolean;
  disabled?: boolean;
  marginBottom?: number;
  icon?: ReactNode;
  style?: any;
  labelStyle?: TextStyle;
  loading?: boolean;
  bg?: string;
};

export default function BtnDefault({
  label,
  onPress,
  white = false,
  loading,
  disabled = false,
  marginBottom,
  style,
  labelStyle,
  icon,
  bg,
}: Props) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    btn: {
      height: 45,
      backgroundColor: bg
        ? bg
        : white
        ? theme?.navigation?.dark
          ? theme?.customColors?.baseBlack || '#000000'
          : theme?.customColors?.baseWhite || '#FFFFFF'
        : theme?.customColors?.secondary?.default || '#007AFF',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      borderWidth: 1,
      borderColor: bg
        ? bg
        : false || white
        ? theme?.navigation?.dark
          ? theme?.customColors?.baseWhite || '#FFFFFF'
          : theme?.customColors?.secondary?.default || '#007AFF'
        : theme?.customColors?.secondary?.default || '#007AFF',
      opacity: disabled ? 0.6 : 1,
      marginBottom: marginBottom,
      flexDirection: icon ? 'row' : 'column',
      gap: icon ? 10 : 0,
    },
    txt: {
      fontSize: 14,
      fontFamily: theme?.fonts?.semiBold || 'NunitoSans_600SemiBold',
      color: white
        ? theme?.navigation?.dark
          ? theme?.customColors?.baseWhite || '#FFFFFF'
          : theme?.customColors?.secondary?.default || '#007AFF'
        : theme?.customColors?.baseWhite || '#FFFFFF',
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, style]} disabled={loading || disabled}>
      {icon && icon}
      <Text style={[styles.txt, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}
