import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import BottomSheet from '../../../../../components/BottomSheet';
import { useCustomStyles } from './style';
import { useTheme } from '~/context/MyThemeContext';
import LockOpen from '~/../assets/newSvgs/icons/lock_open.svg';
import Finger from '~/../assets/newSvgs/icons/Biometria.svg';
import SecureStorage from '~/storages/secure-storage';
import { useAuth } from '~/context/auth';
import { Analytics } from '~/helpers/analytics';

type Props = {
  refRBSheet: any;
  onClose(): void;
};

export default function EnableAuth({ refRBSheet, onClose }: Props) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { onSignIn } = useAuth();

  function setStorage(status: boolean) {
    SecureStorage.SetLoginBiometry({ checked: status });
    SecureStorage.SetInvestBiometry({ checked: status });
    onSignIn();
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
