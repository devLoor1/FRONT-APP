import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Input from "@/components/Input";
import CommonValidators from "@/helpers/validators/common.validators";
import { Analytics } from "@/helpers/analytics";
import BtnDefault from "@/components/BtnDefault";
import { useCustomStyles } from "../../style";
import { useNavigation } from "@react-navigation/native";
import { postRecover } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import Snack from "@/components/Snack";
import { reset } from "@/redux/reducers/forget";

type GeneralProps = {
  readonly onSuccess: () => void;
};

export default function GeneralPage({ onSuccess }: GeneralProps) {
  const nav = useNavigation();
  const [error, setError] = useState({
    email: "",
  });
  const [email, setEmail] = useState("");
  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const styles = useCustomStyles();

  const { mutateAsync: recoverMutation, isPending: loading } = useMutation({
    mutationKey: [postRecover.name],
    mutationFn: postRecover,
  });

  useEffect(() => {
    Analytics({ pageName: "EsqueciSenha" });
  }, []);

  function handleField(value: React.SetStateAction<string>) {
    setEmail(value);
  }

  async function onClickRecover() {
    const emailValidator = CommonValidators.isEmailValid(email);
    setError({ email: emailValidator.error });
    if (emailValidator.status) {
      try {
        await recoverMutation({ email });
        onSuccess();
      } catch (error: any) {
        let errorMessage = "Erro ao processar a solicitação";

        const errorData = error?.response?.data as any;

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
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Recuperar senha</Text>
        <Text style={styles.desc}>
          Esqueceu a sua senha? Não se preocupe, vamos recuperá-la.
        </Text>
        <Input
          placeholder="Insira o seu endereço de e-mail *"
          value={email.toLowerCase()}
          autoCapitalize="none"
          setValue={(value) => handleField(value)}
          autoComplete="email"
          keyboardType="email-address"
          error={!!error.email}
          txtError={error.email}
          marginBottom={40}
        />
      </ScrollView>
      <View style={styles.footer}>
        <BtnDefault
          label="Continuar"
          onPress={() => {
            Analytics({ eventName: "EsqueciSenha_Continuar" });
            onClickRecover();
          }}
          loading={loading}
          disabled={loading}
        />
        <BtnDefault
          label="Ir para a Home"
          white
          onPress={() => {
            Analytics({ eventName: "EsqueciSenha_Home" });
            nav.goBack();
          }}
          disabled={loading}
        />
      </View>
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
