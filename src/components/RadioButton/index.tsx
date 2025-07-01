import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HelperText } from 'react-native-paper';
import { Text, View } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';
import { useCustomStyles } from './style';

type ButtonProps = {
  onValueChange: (value: any) => void;
  value: string | boolean | null;
  legend: string;
  error?: boolean;
  txtError?: string;
  data: {
    label: string;
    boldLabel?: string;
    value: string | boolean;
  }[];
  row?: boolean;
};

export default function RadioButton({
  onValueChange,
  value,
  legend,
  data,
  error,
  txtError,
  row,
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = useCustomStyles();

  return (
    <View style={styles.group}>
      <Text style={styles.desc}>{legend}</Text>
      <View
        style={{
          flexDirection: row ? 'row' : 'column',
          gap: row ? 6 : 0,
        }}>
        {data.map(item => (
          <View style={{ flex: 1 }} key={item.boldLabel + item.label}>
            <TouchableOpacity onPress={() => onValueChange(item.value)}>
              <View
                style={{
                  ...styles.item,
                  backgroundColor:
                    value === item.value
                      ? theme.customColors.secondary[700]
                      : theme.dark
                      ? theme.customColors.neutrals[800]
                      : theme.customColors.neutrals[100],
                }}>
                <View
                  style={{
                    ...styles.radio,
                    borderColor:
                      value === item.value ? theme.customColors.baseWhite : theme.colors.text,
                  }}>
                  {value === item.value && <View style={styles.fillRadio} />}
                </View>
                <Text
                  style={{
                    ...styles.label,
                    color: value === item.value ? theme.customColors.baseWhite : theme.colors.text,
                  }}>
                  {item.boldLabel && <Text>{item.boldLabel}</Text>}
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <HelperText
        type="error"
        visible={error}
        theme={{ colors: { error: theme.customColors.error.default } }}>
        {txtError}
      </HelperText>
    </View>
  );
}
