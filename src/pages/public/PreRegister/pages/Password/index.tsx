import { View, Text, BackHandler, Platform } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useEffect, useState } from 'react';
import { SendPassword } from '@/services/lead';
import { Analytics } from '@/helpers/analytics';
import PasswordComp from '@/components/Password';
import BtnDefault from '@/components/BtnDefault';
import { useCustomStyles } from '../../style';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Password() {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const { hash, loadingConfirm } = useAppSelector(state => state.lead);
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



  async function onClickPassword() {
    if (isValidPassword && hash && hash.hash) {

      await AsyncStorage.setItem('userPasswordLogin', password);

      await dispatch(
        SendPassword({
          hash: hash.hash,
          password,
          passwordConfirm,
        })
      );
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
          onClickPassword();
        }}
        disabled={!isValidPassword}
      />
    </>
  );
}
