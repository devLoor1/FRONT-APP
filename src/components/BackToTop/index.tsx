import React from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SectionList,
} from "react-native";
import { useTheme } from "@/context/MyThemeContext";
import ArrowIcon from "@/../assets/newSvgs/icons/arrow_upward_alt.svg";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { Portal } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";

type BackPageType = {
  listRef?: React.RefObject<FlatList<any> | SectionList<any> | null>;
  scrollRef?: React.RefObject<ScrollView | null>;
  mb?: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

export default function BackToTop({ listRef, scrollRef, mb }: BackPageType) {
  const moveToTop = () => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTo({ animated: true, y: 0 });
    } else if (listRef?.current) {
      (listRef.current as any)?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const { theme } = useTheme();
  const isFocused = useIsFocused();

  const styles = StyleSheet.create({
    toUpBtn: {
      position: "absolute",
      right: 36,
      bottom: mb ?? 8,
      width: 36,
      height: 36,
      borderRadius: 36,
      backgroundColor: theme.customColors.secondary.default,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      shadowColor: "rgba(0, 0, 0, 1)",
      shadowOffset: { width: -1, height: 3 },
      shadowRadius: 36,
      shadowOpacity: 0.15,
    },
  });

  if (!isFocused) return null;

  return (
    <Portal>
      <AnimatedPressable
        entering={ZoomIn.duration(100)}
        exiting={ZoomOut.duration(100)}
        style={styles.toUpBtn}
        onPress={moveToTop}
      >
        <ArrowIcon color={theme.customColors.baseWhite} />
      </AnimatedPressable>
    </Portal>
  );
}
