import { View, Text, BackHandler, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";

import PasswordComp from "@/components/Password";
import BtnDefault from "@/components/BtnDefault";
import Snack from "@/components/Snack";
import { Analytics } from "@/helpers/analytics";
import { postRegister } from "@/services/auth";
import { RegisterRequest } from "@/models/auth/register.request";
import { useCustomStyles } from "../../style";
import { reset } from "@/redux/reducers/register";

type Props = {
  readonly registerPayload: RegisterRequest;
  readonly onComplete: () => void;
};

export default function Password({ registerPayload, onComplete }: Props) {
  const styles = useCustomStyles();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
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
    if (isValidPassword) {
      await AsyncStorage.setItem('userPasswordLogin', password);

      try {
        await postPreRegister({
          ...registerPayload,
          password
        });

        onComplete();
      } catch (error: any) {
        let errorMessage = "Erro ao processar o cadastro";

        const errorData = error?.response?.data;

        if (errorData?.errors?.[0]?.message) {
          errorMessage = errorData.errors[0].message;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        setSnackMessage(errorMessage);
        setShowSnack(true);
      }
    }
  }

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
      <Snack
        visible={showSnack}
        txt={snackMessage}
        setShowSnack={setShowSnack}
        reset={reset}
        type="error"
        duration={5000}
      />
    </>
  );
}
