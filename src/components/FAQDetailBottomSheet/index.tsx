import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
// import WebView from 'react-native-webview';
import BottomSheet from "../BottomSheet";
import { useCustomStyles } from "./style";
import BtnIcon from "../BtnIcon";
import { useTheme } from "@/context/MyThemeContext";
import CloseIcon from "@/../assets/newSvgs/icons/close_small.svg";
import { useAppSelector } from "@/redux/hooks";
import { Analytics } from "@/helpers/analytics";

type Props = {
  refRBSheet: any;
};

export default function FAQDetailBottomSheet({ refRBSheet }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useCustomStyles(insets);
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);
  const { newsItem, loading } = useAppSelector((state) => state.faq);

  const fullHeight =
    Dimensions.get("screen").height - (StatusBar.currentHeight || 0);

  useEffect(() => {
    Analytics({ pageName: "MeuPerfilFAQ_DetailCard" });
  }, []);

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      height={fullHeight}
      background={
        theme.dark
          ? theme.customColors.neutrals[800]
          : theme.customColors.neutrals[100]
      }
      onClose={() => setScrollEnabled(false)}
      onOpen={() => setScrollEnabled(true)}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {loading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator
                color={theme.customColors.secondary.default}
                size="large"
              />
            </View>
          ) : (
            <>
              <View style={styles.imageContainer}>
                <ImageBackground
                  source={{ uri: newsItem?.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <BtnIcon
                  style={{
                    top: 8,
                    position: "absolute",
                    zIndex: 10,
                    left: 0,
                  }}
                  width={40}
                  height={40}
                  bgColor={theme.customColors.baseBlack}
                  onPress={() => refRBSheet.current?.close()}
                >
                  <CloseIcon
                    color={theme.customColors.baseWhite}
                    width={24}
                    height={24}
                  />
                </BtnIcon>
              </View>

              <ScrollView
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator
                scrollEnabled={scrollEnabled}
              >
                <Text style={styles.title}>{newsItem?.title}</Text>
                {/* {newsItem && (
                  <WebView
                    pointerEvents="box-none"
                    style={{
                      flex: 1,
                      height: 310,
                      backgroundColor: 'transparent',
                      zIndex: 0,
                    }}
                    originWhitelist={['*']}
                    source={{
                      html: `
                        <html>
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <body>
                            <style>
                              * { font-family: "Nunito Sans", sans-serif; }
                            </style>
                            <div style="color: ${theme.colors.text}; font-size: 14px;">
                              ${newsItem.content}
                            </div>
                          </body>
                        </html>
                      `,
                    }}
                  />
                )} */}
              </ScrollView>
            </>
          )}
        </View>
      </SafeAreaView>
    </BottomSheet>
  );
}
