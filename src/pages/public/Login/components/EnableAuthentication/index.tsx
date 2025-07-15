import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCustomStyles } from './style';
import { useTheme } from '@/context/MyThemeContext';
import LockOpen from '@/../assets/newSvgs/icons/lock_open.svg';
import Finger from '@/../assets/newSvgs/icons/Biometria.svg';
import SecureStorage from '@/storages/secure-storage';
import BottomSheet from '@/components/BottomSheet';
import { useAuth } from '@/context/auth';
import { Analytics } from '@/helpers/analytics';
import { useAppDispatch } from '@/redux/hooks';
import { setLoginData } from '@/redux/reducers/auth';
import { postLogin } from '@/services/auth';

type Props = {
  readonly refRBSheet: any;
  onClose(): void;
};

export default function EnableAuth({ refRBSheet, onClose }: Readonly<Props>) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { onSignIn } = useAuth();
  const dispatch = useAppDispatch();

  async function setStorage(status: boolean) {
    try {
      // Salvar preferência de biometria
      SecureStorage.SetLoginBiometry({ checked: status });
      SecureStorage.SetInvestBiometry({ checked: status });

      // Se habilitou biometria, tentar fazer login automático
      if (status) {
        const email = await AsyncStorage.getItem("userEmailLogin");
        const password = await AsyncStorage.getItem("userPasswordLogin");

        if (email && password) {
          const loginResponse = await postLogin({
            email: email,
            password: password,
          });

          dispatch(setLoginData(loginResponse));
          await AsyncStorage.multiRemove(["userEmailLogin", "userPasswordLogin"]);
        }
      }

      onSignIn();
    } catch (error) {
      console.error("Erro ao configurar autenticação:", error);
      onSignIn();
    }
  }

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      onClose={onClose}
      onOpen={() => Analytics({ pageName: 'TABAutenticacao' })}>
      <View style={{ alignItems: 'center' }}>
        <View style={styles.enableIcon}>
          <LockOpen width={72} height={70} color={theme.customColors.baseWhite} />
        </View>
        <Text style={styles.enableTxt}>
          Gostaria de habilitar autenticação automática a partir do seu próximo login?
        </Text>
        <TouchableOpacity
          onPress={() => {
            Analytics({ eventName: 'TABAutenticacao_Habilitar' });
            setStorage(true);
          }}
          style={styles.enableBtn}>
          <Finger width={24} color={theme.customColors.secondary.default} />
          <Text style={styles.enableBtnTxt}>Habilitar autenticação automática</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Analytics({ eventName: 'TABAutenticacao_NaoHabilitar' });
            setStorage(false);
          }}
          style={styles.disableBtn}>
          <Text style={styles.disableBtnTxt}>Não habilitar login automático</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
