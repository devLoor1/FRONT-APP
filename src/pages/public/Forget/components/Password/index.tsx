import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { SendNewPassword } from '~/services/forget';
import Snack from '~/components/Snack';
import { Analytics } from '~/helpers/analytics';
import BtnDefault from '~/components/BtnDefault';
import PasswordComp from '~/components/Password';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';
import { useCustomStyles } from '../../style';

type PasswordProps = {
  reset(): void;
  setShowSnack: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PasswordPage({ setShowSnack, reset }: PasswordProps) {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(false);
  const { requestError, loading } = useAppSelector(state => state.forget);
  const { newIdentifierData } = useAppSelector(state => state.register);
  const styles = useCustomStyles();

  useEffect(() => {
    Analytics({ pageName: 'EsqueceuSenhaNova' });
  }, []);

  async function onClickPassword() {
    if (isValidPassword) {
      await dispatch(
        SendNewPassword({
          request: {
            newPassword: password,
            confirmPassword: passwordConfirm,
            profile: 'investor',
          },
          token: newIdentifierData?.token || '',
        })
      );
    }
  }

  return (
    <>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Nova senha</Text>
        <Text style={styles.desc}>
          Defina sua nova senha de acesso à plataforma. Atente-se para os requisitos de uma senha
          segura.
        </Text>
        <PasswordComp
          labelPassword="Digite sua nova senha *"
          labelSecondPassword="Confirme sua nova senha *"
          password={password}
          secondPassword={passwordConfirm}
          setPassword={setPassword}
          setSecondPassword={setPasswordConfirm}
          setIsValidPassword={setIsValidPassword}
        />
      </ScrollView>
      <View style={styles.footer}>
        <BtnDefault
          label={loading ? 'Atualizando senha...' : 'Atualizar senha'}
          disabled={!isValidPassword}
          loading={loading}
          onPress={() => {
            Analytics({ eventName: 'EsqueceuSenhaNova_Atualizar' });
            onClickPassword();
          }}
        />
      </View>
      <Snack
        visible={!!requestError}
        txt={requestError}
        setShowSnack={setShowSnack}
        reset={reset}
      />
    </>
  );
}
