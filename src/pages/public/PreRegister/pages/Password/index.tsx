import { View, Text, BackHandler, Platform } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useEffect, useState } from 'react';
import { Analytics } from '@/helpers/analytics';
import PasswordComp from '@/components/Password';
import BtnDefault from '@/components/BtnDefault';
import { useCustomStyles } from '../../style';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterRequest } from '@/models/new/auth/register.request';
import { PostRegister } from '@/services/new/register';

type Props = {
  readonly registerPayload: RegisterRequest;
  readonly onPress: () => void;
};

export default function Password({ registerPayload, onPress }: Props) {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const { loadingConfirm } = useAppSelector(state => state.lead);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    Analytics({ pageName: 'CadastroDefinirSenha' });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

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
        await dispatch(PostRegister(registerPayload));

        onPress();
      } catch (error) {
        console.error('Erro ao persistir dados:', error);
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
        style={{ marginBottom: Platform.OS === 'android' ? 20 : 0 }}
        label="Continuar"
        loading={loadingConfirm}
        onPress={() => {
          Analytics({ eventName: 'CadastroDefinirSenha_Continuar' });
          onSubmit();
        }}
        disabled={!isValidPassword}
      />
    </>
  );
}
