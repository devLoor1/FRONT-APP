import { View, Text, BackHandler, Platform, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";

import PasswordComp from "@/components/Password";
import BtnDefault from "@/components/BtnDefault";
import { Analytics } from "@/helpers/analytics";
import { postRegister } from "@/services/auth";
import { RegisterRequest } from "@/models/auth/register.request";
import { useCustomStyles } from "../../style";
import { useTheme } from "@/context/MyThemeContext";

type Props = {
  readonly registerPayload: RegisterRequest;
  readonly onComplete: () => void;
};

export default function Password({ registerPayload, onComplete }: Props) {
  const styles = useCustomStyles();
  const { theme } = useTheme();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  const { mutateAsync: postPreRegister, isPending } = useMutation({
    mutationKey: [postRegister.name],
    mutationFn: postRegister,
  });

  useEffect(() => {
    Analytics({ pageName: "CadastroDefinirSenha" });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    navigation.setOptions?.({
      gestureEnabled: false,
      headerLeft: () => null,
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  async function onSubmit() {
    if (!isValidPassword) return;

    setErrorMessage("");
    await AsyncStorage.setItem('userPasswordLogin', password);

    try {
      await postPreRegister({
        ...registerPayload,
        password
      });

      onComplete();
    } catch (error: any) {
      let msg = "Erro ao processar o cadastro. Tente novamente.";

      const errorData = error?.response?.data;

      if (errorData?.errors?.[0]?.message) {
        msg = errorData.errors[0].message;
      } else if (errorData?.message) {
        msg = errorData.message;
      } else if (error?.message) {
        msg = error.message;
      }

      setErrorMessage(msg);
    }
  }

  const errorColor = theme?.customColors?.error?.[300] || "#E53935";

  const localStyles = StyleSheet.create({
    errorBox: {
      backgroundColor: errorColor + "18",
      borderWidth: 1,
      borderColor: errorColor,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    errorText: {
      color: errorColor,
      fontSize: 14,
      fontFamily: theme?.fonts?.regular || "NunitoSans_400Regular",
      lineHeight: 20,
      textAlign: "center",
    },
  });

  return (
    <>
      <View style={{ flexGrow: 1 }}>
        <Text style={{ ...styles.title, marginBottom: 48 }}>Escolha sua senha</Text>
        <Text style={styles.desc}>
          Defina uma senha de acesso à plataforma. Atente-se para os requisitos de uma senha segura.
        </Text>
        <PasswordComp
          labelPassword="Digite sua senha *"
          labelSecondPassword="Confirme sua senha *"
          password={password}
          secondPassword={passwordConfirm}
          setPassword={setPassword}
          setSecondPassword={setPasswordConfirm}
          setIsValidPassword={setIsValidPassword}
        />
      </View>

      {!!errorMessage && (
        <View style={localStyles.errorBox}>
          <Text style={localStyles.errorText}>⚠ {errorMessage}</Text>
        </View>
      )}

      <BtnDefault
        style={{ marginBottom: Platform.OS === "android" ? 20 : 0 }}
        label="Continuar"
        loading={isPending}
        onPress={() => {
          Analytics({ eventName: "CadastroDefinirSenha_Continuar" });
          onSubmit();
        }}
        disabled={!isValidPassword || isPending}
      />
    </>
  );
}
