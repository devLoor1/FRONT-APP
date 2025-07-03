import { View, Text, BackHandler, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { Analytics } from "@/helpers/analytics";
import PasswordComp from "@/components/Password";
import BtnDefault from "@/components/BtnDefault";
import { RegisterRequest } from "@/models/new/auth/register.request";
import { postRegister } from "@/services/new/register";
import { useCustomStyles } from "../../style";

type Props = {
  readonly registerPayload: RegisterRequest;
  readonly onPress: () => void;
};

export default function Password({ registerPayload, onPress }: Props) {
  const styles = useCustomStyles();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const navigation = useNavigation();

  const { mutateAsync: sendPassword, isPending } = useMutation({
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
    if (isValidPassword) {
      await AsyncStorage.setItem("userPasswordLogin", password);

      try {
        await sendPassword(registerPayload);
        onPress();
      } catch (error) {
        console.error("Erro ao persistir dados:", error);
      }
    }
  }

  return (
    <>
      <View style={{ flexGrow: 1 }}>
        <Text style={{ ...styles.title, marginBottom: 48 }}>
          Escolha sua senha
        </Text>
        <Text style={styles.desc}>
          Defina uma senha de acesso à plataforma. Atente-se para os requisitos
          de uma senha segura.
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
      <BtnDefault
        style={{ marginBottom: Platform.OS === "android" ? 20 : 0 }}
        label="Continuar"
        loading={isPending}
        onPress={() => {
          Analytics({ eventName: "CadastroDefinirSenha_Continuar" });
          onSubmit();
        }}
        disabled={!isValidPassword}
      />
    </>
  );
}
