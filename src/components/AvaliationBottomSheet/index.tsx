import { View, Text, Linking, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import BottomSheet from "../BottomSheet";
import { useCustomStyles } from "./style";
import BtnDefault from "../BtnDefault";
// import StarRating from 'react-native-star-rating-widget';
import { TextInput } from "react-native-paper";
import { useTheme } from "@/context/MyThemeContext";
import { useAppDispatch } from "@/redux/hooks";
import { PostAvaliation } from "@/services/avaliation";
import { Analytics } from "@/helpers/analytics";
import { safeLogger } from "@/helpers/observability";

type Props = {
  refRBSheet: any;
};

export default function AvaliationBottomSheet({ refRBSheet }: Props) {
  const styles = useCustomStyles();
  const [rating, setRating] = useState(5);
  const [showAvaliation, setShowAvaliation] = useState(true);
  const [showAvaliationStore, setShowAvaliationStore] = useState(false);
  const [comment, setComment] = useState("");
  const maxCharacters = 300;
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setShowAvaliation(true);
    setShowAvaliationStore(false);
    Analytics({ pageName: "AvaliacaoApp" });
  }, []);

  const openAppStore = () => {
    const iosUrl =
      "itms-apps://apps.apple.com/us/app/wealth-money/id1565245480";
    const androidUrl = "market://details?id=vc.com.wisemoney.investor";

    const storeUrl = Platform.OS === "ios" ? iosUrl : androidUrl;

    Linking.openURL(storeUrl).catch((err) => {
      safeLogger.error("App store link failed", err);
    });
  };

  async function handleAvaliation() {
    setShowAvaliation(false);
    setShowAvaliationStore(true);

    await dispatch(
      PostAvaliation({
        ratingValue: rating,
        comment,
      })
    );
  }

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      height={530}
      background={theme.dark ? theme.customColors.neutrals[800] : "#fff"}
    >
      <View style={styles.container}>
        {showAvaliation && (
          <>
            <Text style={styles.title}>Avaliação</Text>
            <Text style={styles.subtitle}>
              O que você achou da sua experiência de investir pela{" "}
              <Text style={styles.bold}>Wealth Money?</Text>
            </Text>

            <View style={styles.starsWrapper}>
              {/*  <StarRating
                rating={rating}
                onChange={setRating}
                starSize={45}
                color="#0054A6"
                emptyColor="#C4C4C4"
                enableHalfStar={false}FAVa

                style={styles.starRating}
                starStyle={styles.star}
              /> */}
            </View>

            <View style={styles.commentHeader}>
              <Text style={styles.commentTitle}>Deixe seu comentário</Text>
              <Text style={styles.charCount}>
                {comment.length}/{maxCharacters}
              </Text>
            </View>

            <View style={styles.containerTextArea}>
              <TextInput
                style={styles.textArea}
                multiline
                maxLength={maxCharacters}
                numberOfLines={4}
                placeholder="Conte-nos o que você gostou (opcional)"
                value={comment}
                onChangeText={setComment}
                textAlignVertical="top"
                underlineColorAndroid="transparent"
                theme={{ colors: { primary: "#EFEFEF" } }}
              />
            </View>

            <BtnDefault
              label="Enviar comentário"
              onPress={() => {
                handleAvaliation();
              }}
            />
          </>
        )}

        {showAvaliationStore && (
          <>
            <Text style={styles.title}>Agradecemos por sua avaliação!</Text>
            <Text style={styles.subtitle}>
              Seu comentário é muito importante para que possamos continuar
              melhorando.
              {rating > 4 && (
                <Text>
                  {" "}
                  Se puder, avalie também nosso app na loja — sua opinião faz
                  toda a diferença!{" "}
                </Text>
              )}
            </Text>

            {rating > 4 && (
              <BtnDefault
                label="Ir para loja de aplicativos"
                onPress={openAppStore}
                marginBottom={20}
              />
            )}
            <BtnDefault
              label="Fechar"
              white
              onPress={() => {
                refRBSheet.current?.close();
              }}
            />
          </>
        )}
      </View>
    </BottomSheet>
  );
}
