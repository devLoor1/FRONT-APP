/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useAppDispatch } from '../../redux/hooks';
import { useTheme } from '@/context/MyThemeContext';

type SnackType = 'success' | 'error' | 'warning' | 'info';

interface SnackProps {
  txt: string;
  visible: boolean;
  setShowSnack: React.Dispatch<React.SetStateAction<boolean>>;
  reset?: () => any;
  duration?: number;
  type?: SnackType;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export default function Snack({
  txt,
  visible,
  reset,
  setShowSnack,
  duration = 4000,
  type = 'error',
  onDismiss,
  action,
}: SnackProps) {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return theme.customColors.success?.default || '#4CAF50';
      case 'warning':
        return theme.customColors.warning?.default || '#FF9800';
      case 'info':
        return theme.customColors.secondary?.[500] || '#2196F3';
      case 'error':
      default:
        return theme.customColors.error?.[300] || '#F44336';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'warning':
        return theme.customColors.baseBlack;
      default:
        return theme.customColors.baseWhite;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: getBackgroundColor() + 'CC',
      borderRadius: 8,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      minWidth: 200,
      maxWidth: '100%',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    icon: {
      fontSize: 18,
      marginRight: 8,
      color: getTextColor(),
    },
    txt: {
      flex: 1,
      color: getTextColor(),
      fontFamily: theme.fonts.regular,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },
    actionButton: {
      marginLeft: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    actionText: {
      color: getTextColor(),
      fontFamily: theme.fonts.semiBold,
      fontSize: 12,
    },
  });

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss após o tempo definido
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim, duration]);

  function handleDismiss() {
    if (reset) {
      dispatch(reset());
    }
    if (onDismiss) {
      onDismiss();
    }
    setShowSnack(false);
  }

  if (!visible || !txt) {
    return null;
  }

      return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
          { position: 'absolute', bottom: 20, left: 16, right: 16, zIndex: 1000 },
        ]}>
        <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.txt} numberOfLines={3}>
            {txt}
          </Text>
          {action && (
            <View style={styles.actionButton}>
              <Text style={styles.actionText} onPress={action.onPress}>
                {action.label}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
}
