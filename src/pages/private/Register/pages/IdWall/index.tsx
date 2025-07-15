import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { Analytics } from '~/helpers/analytics';
import IdwallSdk, {
  IdwallDocumentOption,
  IdwallDocumentType,
  IdwallFlowType,
} from '@idwall/react-native-idwall-sdk';
import AuthStorage from '~/storages/auth-storage';
import refreshToken from '~/helpers/refreshToken';
import { SendToken } from '~/services/idWall';
import { resetToken } from '~/redux/reducers/idWall';
import LoadingComp from '~/components/Loading';
import { GetUserStatus } from '~/services/user';
import { useAuth } from '~/context/auth';
import { useCustomStyles } from './style';
import { SafeAreaView, Text, View } from 'react-native';
import BtnDefault from '~/components/BtnDefault';

export default function IdWall() {
  const dispatch = useAppDispatch();
  const { sendToken, loading } = useAppSelector(state => state.idWall);
  const [sendingDocs, setSendingDocs] = useState(false);
  const { deviceToken } = useAuth();
  const styles = useCustomStyles();

  useEffect(() => {
    Analytics({ pageName: 'EnviarDocumentosInicio' });
  }, []);

  function startConnection() {
    Analytics({ eventName: 'EnviarDocumentosInicio_Continuar' });
    setSendingDocs(true);
    IdwallSdk.initialize('24affcee69880cd55d8d6e6bd2df6b04');
    if (IdwallSdk.ios) {
      IdwallSdk.ios.setupPublicKeys([
        'AHYMQP+2/KIo32qYcfqnmSn+N/K3IdSZWlqa2Zan9eY=',
        'tDilFQ4366PMdAmN/kyNiBQy24YHjuDs6Qsa6Oc/4c8=',
      ]);
    }

    IdwallSdk.startFlow(
      IdwallFlowType.COMPLETE,
      [
        IdwallDocumentType.RG, // lista de documentos desejados para o fluxo
        IdwallDocumentType.CNH,
      ],
      [IdwallDocumentOption.PRINTED, IdwallDocumentOption.DIGITAL]
    )
      .then(token => {
        (async () => {
          let accessToken = await AuthStorage.GetPrivateToken();
          const expireToken = await AuthStorage.GetExpire();
          const today = new Date();
          if (expireToken && today >= new Date(expireToken)) {
            let refresh;
            try {
              refresh = await refreshToken();
              accessToken = refresh.accessToken;
            } catch (error) {
              setSendingDocs(false);
            }
          }
          await dispatch(SendToken({ sdkToken: token }));
        })();
      })
      .catch(() => {
        setSendingDocs(false);
      });
  }

  useEffect(() => {
    if (sendToken && sendToken) {
      (async () => {
        await dispatch(GetUserStatus(deviceToken));
        dispatch(resetToken());
      })();
    }
  }, [sendToken]);

  if (loading || sendingDocs) {
    return <LoadingComp txt="Validando documento..." />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={{ ...styles.title, marginTop: 40, marginBottom: 24 }}>
            Validação de documento
          </Text>
          <Text style={styles.desc}>
            Agora que temos suas informações pessoais, só falta você tirar fotos de frente e verso
            do seu RG ou CNH.
          </Text>
          <Text style={styles.desc}>Clique em Avançar para continuar o cadastro.</Text>
        </View>
        <BtnDefault label="Continuar" loading={loading} onPress={startConnection} style={{ marginBottom: 15 }} />
      </View>
    </SafeAreaView>
  );
}
