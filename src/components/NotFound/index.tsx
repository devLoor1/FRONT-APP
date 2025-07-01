import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

type NotFoundProps = {
  desc: string;
  icon?: JSX.Element;
};

export default function NotFoundComp({ desc, icon }: NotFoundProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      background: theme.colors.background,
      padding: 20,
    },
    desc: {
      color: theme.colors.text,
      marginTop: 25,
      maxWidth: 218,
      fontSize: 12,
      lineHeight: 16,
      textAlign: 'center',
      fontFamily: theme.fonts.regular,
    },
  });

  return (
    <View style={styles.container}>
      {/* {icon || <NotFoundIcon color={theme.colors.text} />} */}
      <Text style={styles.desc}>{desc}</Text>
    </View>
  );
}
