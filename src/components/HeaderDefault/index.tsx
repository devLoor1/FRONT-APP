import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useCustomStyles } from "./style";
import ArrowBack from "@/../assets/newSvgs/icons/keyboard_arrow_left.svg";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/MyThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/models/routes/navigation.private";
import { Analytics } from "@/helpers/analytics";

type HeaderProps = {
  readonly title?: string;
  readonly back?: boolean;
  readonly analytics?: string;
  onPressBack?: () => void;
};

export default function HeaderDefault({
  title,
  back,
  analytics,
  onPressBack,
}: Readonly<HeaderProps>) {
  const { theme } = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const styles = useCustomStyles();

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ backgroundColor: theme.customColors.secondary.default }}
    >
      <View style={styles.container}>
        {back && (
          <TouchableOpacity
            style={styles.leftContent}
            onPress={
              onPressBack ||
              (() => {
                Analytics({ eventName: `${analytics}_Voltar` });
                nav.goBack();
              })
            }
          >
            <ArrowBack color={theme.customColors.baseWhite} />
            {title && <Text style={styles.title}>{title}</Text>}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
