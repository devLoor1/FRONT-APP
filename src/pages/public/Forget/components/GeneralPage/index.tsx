import React, { useEffect, useState } from 'react';
import Input from '~/components/Input';
import CommonValidators from '~/helpers/validators/common.validators';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { Analytics } from '~/helpers/analytics';
import BtnDefault from '~/components/BtnDefault';
import { GetHash } from '~/services/user';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';
import { useCustomStyles } from '../../style';
import { useNavigation } from '@react-navigation/native';

type GeneralProps = {
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  email: string;
};

export default function GeneralPage({ setEmail, email }: GeneralProps) {
  const dispatch = useAppDispatch();
  const nav = useNavigation();
  const { loading } = useAppSelector(state => state.user);
  const registerState = useAppSelector(state => state.register);
  const [error, setError] = useState({
    email: '',
  });
  const styles = useCustomStyles();

  useEffect(() => {
    Analytics({ pageName: 'EsqueciSenha' });
  }, []);

  function handleField(value: React.SetStateAction<string>) {
    setEmail(value);
  }

  async function onClickGeneralInfos() {
    const emailValidator = CommonValidators.isEmailValid(email);
    setError({ email: emailValidator.error });
    if (emailValidator.status) {
      await dispatch(GetHash(email));
    }
  }

  return (
    <>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Recuperar senha</Text>
        <Text style={styles.desc}>Esqueceu a sua senha? Não se preocupe, vamos recuperá-la.</Text>
        <Input
          placeholder="Insira o seu endereço de e-mail *"
          value={email.toLowerCase()}
          autoCapitalize="none"
          setValue={value => handleField(value)}
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
            Analytics({ eventName: 'EsqueciSenha_Continuar' });
            onClickGeneralInfos();
          }}
          loading={loading || registerState.loading}
          disabled={loading || registerState.loading}
        />
        <BtnDefault
          label="Ir para a Home"
          white
          onPress={() => {
            Analytics({ eventName: 'EsqueciSenha_Home' });
            nav.goBack();
          }}
          disabled={loading || registerState.loading}
        />
      </View>
    </>
  );
}
