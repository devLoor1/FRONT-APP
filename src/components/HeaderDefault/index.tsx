import React from "react";
import { TouchableOpacity } from "react-native";
import { useCustomStyles } from "./style";
import ArrowBack from "@/../assets/newSvgs/icons/keyboard_arrow_left.svg";
import { useNavigation } from "@react-navigation/native";
import FAQIcon from "@/../assets/newSvgs/icons/help.svg";
import HelpIcon from "@/../assets/newSvgs/icons/forum.svg";
import { Text, View } from "react-native";
import { useTheme } from "@/context/MyThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/models-old/routes/navigation";
import { Analytics } from "@/helpers/analytics";

type HeaderProps = {
  title?: string;
  back?: boolean;
  help?: boolean;
  contact?: boolean;
  analytics?: string;
  onPressBack?: () => void;
};

export default function HeaderDefault({
  title,
  back,
  help,
  contact,
  analytics,
  onPressBack,
}: HeaderProps) {
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

        <View style={styles.iconList}>
          {help && (
            <TouchableOpacity
              onPress={() => {
                Analytics({ eventName: `${analytics}_PrecisaDeAjuda` });
                nav.navigate("FAQ");
              }}
            >
              <FAQIcon
                width={24}
                height={24}
                color={theme.customColors.baseWhite}
              />
            </TouchableOpacity>
          )}
          {contact && (
            <TouchableOpacity
              onPress={() => {
                Analytics({ eventName: `${analytics}_Contato` });
                nav.navigate("Contact");
              }}
            >
              <HelpIcon
                color={theme.customColors.baseWhite}
                width={24}
                height={24}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
