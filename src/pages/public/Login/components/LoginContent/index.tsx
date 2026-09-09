import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCustomStyles } from "./style";
import Input from "@/components/Input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import CommonValidators from "@/helpers/validators/common.validators";
import { postLogin } from "@/services/auth";
import { PublicNavigation } from "@/models/routes/navigation.public";
import { setLoginData, fetchUserData, logout } from "@/redux/reducers/auth";
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
import { usePlatformAppEntryContent } from "@/features/platform-app/usePlatformAppEntryContent";

export default function LoginContent() {
  const content = usePlatformAppEntryContent().login;
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
  } = useMutation({
    mutationKey: [postLogin.name],
    mutationFn: postLogin,
  });

  async function handleSingIn() {
    setEmailError(emailValidator.error);
    setPasswordError(passwordValidator.error);
    if (isFormValid) {
      const loginData = { email: email.toLowerCase(), password };
      await loginMutation(loginData);
    }
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
      let errorMessage = '';
      
      if (loginError?.response?.data) {
        const responseData = loginError.response.data;
        if ('message' in responseData) {
          errorMessage = responseData.message;
        } else if ('errors' in responseData && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
          errorMessage = responseData.errors[0].message;
        }
      }
      
      if (errorMessage) {
        setSnackMessage(errorMessage);
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
    if (!data) return;
    const loginResponse = data;

    async function completeLogin() {
      try {
        const { token } = loginResponse.data;
        api.defaults.headers.Authorization = `Bearer ${token}`;
        await AuthStorage.SetPrivateToken(token);
        dispatch(setLoginData(loginResponse));

        await dispatch(fetchUserData()).unwrap();
      } catch (error) {
        await AuthStorage.ClearPrivateToken();
        delete api.defaults.headers.Authorization;
        dispatch(logout());
        setSnackMessage(
          typeof error === "string"
            ? error
            : "Não foi possível validar sua sessão. Tente novamente.",
        );
        setShowSnack(true);
      }
    }

    void completeLogin();
  }, [data, dispatch]);

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
          <Text style={styles.forgotTxt}>{content.recoverPasswordLabel}</Text>
        </TouchableOpacity>
        <BtnDefault
          label={loading || loadingUser ? "Entrando..." : content.submitLabel}
          disabled={loading || loadingUser || !isFormValid}
          onPress={() => {
            handleAnalyticsUserProfile("signOut");
            Analytics({ eventName: "HomeLogin_Entrar" });
            handleSingIn();
          }}
        />
        <View style={styles.register}>
          <Text style={styles.registerTxt}>{content.registrationPrompt} </Text>
          <TouchableOpacity
            onPress={() => {
              handleAnalyticsUserProfile("signOut");
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
              {content.registrationActionLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.version}>Versão {Version()}</Text>
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
