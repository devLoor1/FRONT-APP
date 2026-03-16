import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCustomStyles } from "./style";
import Input from "@/components/Input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import CommonValidators from "@/helpers/validators/common.validators";
import { postLogin } from "@/services/auth";
import { PublicNavigation } from "@/models/routes/navigation.public";
import { setLoginData, fetchUserData } from "@/redux/reducers/auth";
import { Analytics, handleAnalyticsUserProfile } from "@/helpers/analytics";
import Version from "@/helpers/version/version";
import { useTheme } from "@/context/MyThemeContext";
import Logo from "@/../assets/newSvgs/LogoClaro.svg";
import BtnDefault from "@/components/BtnDefault";
import { TextInput } from "react-native-paper";
import Snack from "@/components/Snack";
import EyeIcon from "@/../assets/newSvgs/icons/visibility.svg";
import EyeOffIcon from "@/../assets/newSvgs/icons/visibility_off.svg";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import AuthStorage from "@/storages/auth-storage";
import { isAxiosError } from "axios";
import LoadingModal from "@/components/LoadingModal";

function extractErrorMessage(error: unknown): string {
  if (!error) return "Ocorreu um erro inesperado. Tente novamente.";

  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: { message?: string }[] } | undefined;
    if (data) {
      if (typeof data.message === "string" && data.message) return data.message;
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors[0].message || "Erro ao tentar entrar.";
      }
    }

    const status = error.response?.status;
    if (status === 401) return "E-mail ou senha incorretos. Verifique e tente novamente.";
    if (status === 403) return "Acesso negado. Entre em contato com o suporte.";
    if (status === 429) return "Muitas tentativas. Aguarde um momento e tente novamente.";
    if (status !== undefined && status >= 500) return "Serviço temporariamente indisponível. Tente novamente em breve.";

    if (error.code === "ERR_NETWORK" || !error.response) {
      return "Sem conexão com o servidor. Verifique sua internet e tente novamente.";
    }
  }

  if (error instanceof Error) {
    return error.message || "Ocorreu um erro inesperado. Tente novamente.";
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}

export default function LoginContent() {
  const { theme } = useTheme();
  const { loadingUser } = useAppSelector((state) => state.auth);

  const styles = useCustomStyles();
  const [hidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const nav = useNavigation<PublicNavigation>();
  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [focusPassword, setFocusPassword] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const cancelledRef = useRef(false);

  const emailValidator = CommonValidators.isEmailValid(email);
  const passwordValidator = CommonValidators.isPasswordValid(password);
  const isFormValid = emailValidator.status && passwordValidator.status;

  const screenWidth = Dimensions.get("window").width;
  const horizontalMargin = 100;
  const maxLogoWidth = screenWidth - horizontalMargin * 2;
  const {
    mutateAsync: loginMutation,
    data,
    error: loginError,
    isPending: loading,
    reset: resetMutation,
  } = useMutation({
    mutationKey: [postLogin.name],
    mutationFn: postLogin,
  });

  async function handleSingIn() {
    setEmailError(emailValidator.error);
    setPasswordError(passwordValidator.error);
    if (isFormValid) {
      cancelledRef.current = false;
      setShowLoadingModal(true);
      const loginData = { email: email.toLowerCase(), password };
      await loginMutation(loginData).catch(() => {});
    }
  }

  function handleCancelLogin() {
    cancelledRef.current = true;
    setShowLoadingModal(false);
    resetMutation();
  }

  function togglePassword() {
    setHidePassword(!hidePassword);
  }

  useEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
    };
  }, []);

  useEffect(() => {
    if (loginError) {
      setShowLoadingModal(false);
      if (!cancelledRef.current) {
        const message = extractErrorMessage(loginError);
        setSnackMessage(message);
        setShowSnack(true);
      }
    }
  }, [loginError]);

  useEffect(() => {
    if (!showSnack) {
      setSnackMessage("");
    }
  }, [showSnack]);

  useEffect(() => {
    if (data && !cancelledRef.current) {
      const { token } = data.data;
      api.defaults.headers.Authorization = `Bearer ${token}`;
      AuthStorage.SetPrivateToken(token);

      dispatch(setLoginData(data));
      dispatch(fetchUserData());
      setShowLoadingModal(false);
    }
  }, [data, dispatch]);

  const isProcessing = loading || loadingUser;

  return (
    <>
      <View style={styles.container}>
        <View style={{ paddingHorizontal: horizontalMargin }}>
          <View style={styles.logo}>
            <Logo width={maxLogoWidth} height={maxLogoWidth * 0.25} />
          </View>
        </View>
        <Input
          placeholder="Login *"
          value={email.toLowerCase()}
          autoCapitalize="none"
          setValue={setEmail}
          autoComplete="email"
          keyboardType="email-address"
          error={!!emailError}
          txtError={emailError}
        />

        <Input
          autoComplete="password"
          placeholder="Senha *"
          secureTextEntry={hidePassword}
          value={password}
          setValue={setPassword}
          error={!!passwordError}
          txtError={passwordError}
          textContentType={focusPassword ? "oneTimeCode" : undefined}
          onFocus={() => setFocusPassword(true)}
          onPressOut={() => setFocusPassword(false)}
          right={
            <TextInput.Icon
              icon={() =>
                hidePassword ? (
                  <EyeOffIcon
                    color={
                      theme?.navigation?.dark
                        ? theme?.customColors?.neutrals?.[400] || "#969595"
                        : theme?.customColors?.baseBlack || "#000000"
                    }
                  />
                ) : (
                  <EyeIcon
                    color={
                      theme?.navigation?.dark
                        ? theme?.customColors?.neutrals?.[400] || "#969595"
                        : theme?.customColors?.baseBlack || "#000000"
                    }
                  />
                )
              }
              style={{ marginTop: 15 }}
              onPress={() => togglePassword()}
            />
          }
        />
        <TouchableOpacity
          onPress={() => {
            Analytics({ eventName: "HomeLogin_EsqueciSenha" });
            nav.navigate("Forget");
          }}
          style={styles.forgot}
        >
          <Text style={styles.forgotTxt}>Esqueci minha senha</Text>
        </TouchableOpacity>
        <BtnDefault
          label="Entrar"
          disabled={isProcessing || !isFormValid}
          onPress={() => {
            handleAnalyticsUserProfile("signOut", {});
            Analytics({ eventName: "HomeLogin_Entrar" });
            handleSingIn();
          }}
        />
        <View style={styles.register}>
          <Text style={styles.registerTxt}>Não tem uma conta? </Text>
          <TouchableOpacity
            onPress={() => {
              handleAnalyticsUserProfile("signOut", {});
              Analytics({ eventName: "HomeLogin_CriarConta" });
              nav.navigate("PreRegister" as never);
            }}
          >
            <Text
              style={{
                ...styles.registerTxt,
                fontFamily: theme?.fonts?.bold || "NunitoSans_700Bold",
              }}
            >
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.version}>Versão {Version()}</Text>
      <LoadingModal
        visible={showLoadingModal}
        message="Entrando na sua conta"
        onCancel={handleCancelLogin}
      />
      <Snack
        visible={showSnack}
        txt={snackMessage}
        setShowSnack={setShowSnack}
        type="error"
        duration={5000}
      />
    </>
  );
}
