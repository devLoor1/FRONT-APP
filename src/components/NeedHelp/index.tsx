import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from '@/context/MyThemeContext';
import ChatIcon from '@/../assets/newSvgs/icons/chat.svg';

type Props = {
  marginTop?: number;
  white?: boolean;
  onPress?: () => void;
  preRegister?: boolean;
};

export default function NeedHelp({ marginTop = 0, white, onPress, preRegister }: Props) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    help: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: marginTop,
      gap: 8,
    },
    helpTxt: {
      color: white ? theme?.customColors?.baseWhite || '#FFFFFF' : theme?.customColors?.hyperlink || '#007AFF',
      fontSize: 12,
      fontFamily: theme?.fonts?.semiBold || 'NunitoSans_600SemiBold',
    },
  });

  return (
    <TouchableOpacity
      style={styles.help}
      onPress={() => {
        if (onPress) {
          onPress();
        }
        // Navegação para Contact removida temporariamente
        console.log('Precisa de ajuda clicado');
      }}>
      <ChatIcon
        color={white ? theme?.customColors?.baseWhite || '#FFFFFF' : theme?.customColors?.hyperlink || '#007AFF'}
        width={24}
        height={24}
      />
      <Text style={styles.helpTxt}>Precisa de ajuda?</Text>
    </TouchableOpacity>
  );
}
