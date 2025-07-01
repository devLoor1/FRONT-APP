import { Alert, Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { GetStoreVersion } from '@/services/user';
import * as Updates from 'expo-updates';

export default function CheckAppVersion() {
  const dispatch = useAppDispatch();
  const { storeAppVersion } = useAppSelector(state => state.user);
  const iosStoreURL = Constants.expoConfig?.extra?.env.appStore;
  const androidStoreURL = Constants.expoConfig?.extra?.env.playStore;

  useEffect(() => {
    (async () => {
      await dispatch(GetStoreVersion());
    })();
  }, []);

  useEffect(() => {
    if (storeAppVersion) {
      const currentVersion = Updates.channel || 'prod-250625';
      if (+currentVersion.split('-')[1] < +storeAppVersion.version) {
        Alert.alert(
          'Atualização disponível!',
          'Uma nova versão do app está dispoível. Por favor atualize para continuar utilizando o app.',
          [
            {
              text: 'Atualizar agora',
              onPress: async () => {
                Linking.openURL(Platform.OS === 'ios' ? iosStoreURL : androidStoreURL);
                await dispatch(GetStoreVersion());
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  }, [storeAppVersion]);

  return <></>;
}
