import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useTheme } from "@/context/MyThemeContext";
import CloseIcon from "@/../assets/newSvgs/icons/close_small.svg";

type LoadingModalProps = {
  visible: boolean;
  message?: string;
  onCancel: () => void;
};

function SpinnerRing({ color, size = 48 }: { color: string; size?: number }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const borderWidth = size * 0.08;

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: borderWidth,
        borderColor: `${color}20`,
        borderTopColor: color,
        transform: [{ rotate: spin }],
      }}
    />
  );
}

function PulsingDots({ color }: { color: string }) {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createPulse = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
        ])
      );

    const a1 = createPulse(dot1, 0);
    const a2 = createPulse(dot2, 200);
    const a3 = createPulse(dot3, 400);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: color,
            opacity: dot,
          }}
        />
      ))}
    </View>
  );
}

export default function LoadingModal({
  visible,
  message = "Entrando na sua conta",
  onCancel,
}: LoadingModalProps) {
  const { theme } = useTheme();

  const brandColor = theme.customColors.secondary?.default || "#6C63FF";
  const cardBg = theme.dark
    ? theme.customColors.neutrals?.[800] || "#1E1E1E"
    : "#FFFFFF";
  const textColor = theme.dark
    ? theme.customColors.neutrals?.[200] || "#E0E0E0"
    : theme.customColors.neutrals?.[700] || "#333333";
  const subtitleColor = theme.dark
    ? theme.customColors.neutrals?.[400] || "#999999"
    : theme.customColors.neutrals?.[500] || "#666666";
  const closeBtnBg = theme.dark
    ? theme.customColors.neutrals?.[700] || "#2A2A2A"
    : theme.customColors.neutrals?.[200] || "#F0F0F0";

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onCancel}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <TouchableOpacity
            onPress={onCancel}
            style={[styles.closeButton, { backgroundColor: closeBtnBg }]}
            activeOpacity={0.7}
          >
            <CloseIcon
              color={textColor}
              width={14}
              height={14}
            />
          </TouchableOpacity>

          <View style={styles.spinnerContainer}>
            <SpinnerRing color={brandColor} size={56} />
          </View>

          <Text
            style={[
              styles.message,
              { color: textColor, fontFamily: theme.fonts?.semiBold || "NunitoSans_600SemiBold" },
            ]}
          >
            {message}
          </Text>

          <PulsingDots color={brandColor} />

          <Text
            style={[
              styles.subtitle,
              { color: subtitleColor, fontFamily: theme.fonts?.regular || "NunitoSans_400Regular" },
            ]}
          >
            Isso pode levar alguns segundos
          </Text>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  spinnerContainer: {
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
  },
});
