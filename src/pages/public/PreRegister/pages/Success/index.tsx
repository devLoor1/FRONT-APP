import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import BtnDefault from "@/components/BtnDefault";
import { useTheme } from "@/context/MyThemeContext";
import ShieldIcon from "@/../assets/newSvgs/icons/verified_user.svg";
import { Analytics } from "@/helpers/analytics";
import { postLogin } from "@/services/auth";
import { useAppDispatch } from "@/redux/hooks";
import { setLoginData } from "@/redux/reducers/auth";
import { useCustomStyles } from "./style";
import { safeLogger } from "@/helpers/observability";

type Props = {
  resetAll(): void;
};

export default function SuccessPage({ resetAll }: Props) {
  const styles = useCustomStyles();
  const nav = useNavigation();
  const { theme } = useTheme();
  const animation = require("@/../assets/animations/Confetti.json");
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Analytics({ pageName: "CadastroValidacao" });
  }, []);

  async function handleSingIn() {
    try {
      setIsLoading(true);
      
      const email = await AsyncStorage.getItem("userEmailLogin");
      const password = await AsyncStorage.getItem("userPasswordLogin");

      if (!email || !password) {
        Alert.alert(
          "Erro",
          "Não foi possível recuperar as credenciais de login. Por favor, faça login manualmente.",
          [{ 
            text: "OK",
            onPress: () => nav.navigate('Login' as never)
          }]
        );
        return;
      }

      const loginData = {
        email: email,
        password: password,
      };      
      const loginResponse = await postLogin(loginData);

      dispatch(setLoginData(loginResponse));

      await AsyncStorage.multiRemove(["userEmailLogin", "userPasswordLogin"]);
    } catch (error) {
      safeLogger.error("Automatic login after registration failed", error);
      Alert.alert(
        "Erro",
        "Não foi possível fazer login automático. Por favor, faça login manualmente.",
        [{ text: "OK" }]
      );
      nav.navigate('Login' as never);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLoginPress = async () => {
    Analytics({ eventName: "CadastroValidacao_HomeLogin" });
    resetAll();
    await handleSingIn();
  };

  return (
    <LinearGradient
      colors={[theme.customColors.secondary[700], "#013A6A"]}
      style={{ flex: 1 }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
        }}
      >
        <LottieView
          autoPlay={true}
          loop={true}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          source={animation}
        />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.title}>Conta criada com sucesso! 🎉</Text>
            
            <Text style={{ ...styles.desc, fontSize: 18 }}>
              Parabéns! Sua conta foi criada com sucesso. Agora precisamos de mais um passo para ativá-la.
            </Text>
            
            <Text style={{ ...styles.desc, fontFamily: theme.fonts.regular }}>
              Enviamos um email de confirmação para você. Por favor, acesse sua caixa de entrada e clique no link de validação para ativar sua conta.
            </Text>
            
            <Text style={{ ...styles.desc, fontFamily: theme.fonts.regular }}>
              Não conseguiu encontrar o email? Verifique também sua pasta de spam ou lixo eletrônico.
            </Text>
            
            <Text style={styles.desc}>
              Após validar sua conta, você poderá fazer login e aproveitar todos os nossos serviços!
            </Text>

            <View style={{ marginTop: 24, alignItems: "center" }}>
              <ShieldIcon color={theme.customColors.baseWhite} />
            </View>
          </View>

          <View style={styles.footer}>
            <BtnDefault
              label={isLoading ? "Entrando..." : "Entrar"}
              white
              disabled={isLoading}
              onPress={handleLoginPress}
            />
            
            {isLoading && (
              <View style={{ marginTop: 16, alignItems: "center" }}>
                <ActivityIndicator color={theme.customColors.baseWhite} size="small" />
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
