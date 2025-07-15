import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { Analytics } from '~/helpers/analytics';

import { getTokenDocuments, sendDocuments, sendSignedResponse } from '~/services/caf';
import LoadingComp from '~/components/Loading';
import { useCustomStyles } from './style';
import { SafeAreaView, Text, View, TouchableOpacity, Platform } from 'react-native';
import BtnDefault from '~/components/BtnDefault';
import { useTheme } from '~/context/MyThemeContext';
import CheckIcon from '~/../assets/newSvgs/icons/check_circle.svg';
import WarningIcon from '~/../assets/newSvgs/icons/warning.svg';
import Select from '../../../../../components/Select';
import Snack from '~/components/Snack';
import { useNavigation } from '@react-navigation/native';
import ArrowBack from '~/../assets/newSvgs/icons/arrow_back.svg';

import {
  startFaceLiveness,
  useFaceLiveness,
  FaceLivenessSettings,
  Filter,
  Time,
  Stage as FaceLivenessStage
} from '@caf.io/react-native-face-liveness';

import {
  useDocumentDetector,
  DocumentDetectorSettings,
  DocumentDetectorSecuritySettings,
  Stage,
  Document,
  startDocumentDetector
} from '@caf.io/react-native-document-detector';
import SuccessPage from './components/Success';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/models/routes/navigation';

type SelectProps = {
  list: {
    id: string;
    value: string;
  }[];
};

const documentsList: SelectProps = {
  list: [
    {
      id: '1',
      value: 'CNH',
    },
    {
      id: '2',
      value: 'RG',
    },
  ],
}
type Props = Partial<NativeStackScreenProps<RootStackParamList, 'Caf'>>;
export default function Caf({ route }: Props) {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();

  const { loading, mobileToken, personId, cafStatus, requestError } = useAppSelector(state => state.caf);
  const styles = useCustomStyles();
  const nav = useNavigation()
  const [sendLiveness, setSendLiveness] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [error, setError] = useState('');
  const [loadingLiveness, setLoadingLiveness] = useState(false);
  const routeConfig = route?.params?.routeConfig ?? false;

  let retryLiveness = false;
  let retryDocument = false;

  const [form, setForm] = useState({
    documentStatus: 'CNH',
  });

  useEffect(() => {
    Analytics({ pageName: 'EnviarDocumentosInicio' });
  }, []);

  useEffect(() => {
    (async () => {
      await dispatch(getTokenDocuments());
    })();
  }, []);


  const handleStartLiveness = () => {
    setLoadingLiveness(true);
    startFaceLiveness(mobileToken!, personId!);
  };

  const settings: FaceLivenessSettings = {
    cafStage: FaceLivenessStage.PROD,
    filter: Filter.NATURAL,
    imageUrlExpirationTime: Time.THREE_HOURS,
    enableScreenshots: true,
    loadingScreen: false,
  }

  const {
    result: livenessResult,
    error: livenessError,
    cancelled: livenessCancelled
  } = useFaceLiveness(settings);

  useEffect(() => {
    (async () => {
      if (livenessResult) {
        const signedResponse = livenessResult.signedResponse;
        dispatch(sendSignedResponse(signedResponse));
        setSendLiveness(true);
        setLoadingLiveness(false);
      }

      if (livenessError) {
        setLoadingLiveness(false);

        console.error('Erro na detecção de documento:', livenessError);

        if (!retryLiveness) {
          retryLiveness = true;

          await dispatch(getTokenDocuments());
          await startFaceLiveness(mobileToken!, personId!);

        } else {
          setShowSnack(true);
          setError("Token inválido. Entre em contato com suporte.")
        }
      }

      if (livenessCancelled) {
        setLoadingLiveness(false);
      }

    })();
  }, [livenessResult, livenessError, livenessCancelled]);

  const securitySettings: DocumentDetectorSecuritySettings = {
    useAdb: true,
    useDebug: true,
    useDevelopmentMode: true
  };

  const documentSteps =
    form.documentStatus === 'CNH'
      ? [
        {
          document: Document.CNH_FRONT,
          showStepLabel: true,
          stepLabel: 'Frente da CNH',
        },
        {
          document: Document.CNH_BACK,
          showStepLabel: true,
          stepLabel: 'Verso da CNH',
        },
      ]
      : [
        {
          document: Document.RG_FRONT,
          showStepLabel: true,
          stepLabel: 'Frente do RG',
        },
        {
          document: Document.RG_BACK,
          showStepLabel: true,
          stepLabel: 'Verso do RG',
        },
      ];

  const options: DocumentDetectorSettings = {
    documentSteps,
    cafStage: Stage.PROD,
    securitySettings: securitySettings, // apenas para testar no emulador
    style: {
      primaryColor: '#015AA5',
      uploadBackgroundColor: '#000000',
      previewBackgroundColor: '#000000',
    },
    // previewSettings: {
    //   show: true,
    //   subtitle: 'Posicione o documento sobre uma superfície plana',
    //   confirmLabel: 'Entendido'
    // }    
  };

  const {
    result: documentResult,
    error: documentError,
  } = useDocumentDetector(options);

  useEffect(() => {
    (async () => {

      if (documentResult) {
        dispatch(sendDocuments(documentResult));
      }

      if (documentError) {
        console.error('Erro na detecção de documento:', documentError);

        if (!retryDocument) {
          retryDocument = true;

          await dispatch(getTokenDocuments());
          setSendLiveness(false)
        }
      }
    })();
  }, [documentResult, documentError]);

  useEffect(() => {
    (async () => {
      if (requestError && sendLiveness) {
        setShowSnack(true);
        setError(requestError);
        setSendLiveness(false);
      }
    })();
  }, [requestError]);

  if (cafStatus && cafStatus) {
    return <SuccessPage routeConfig={routeConfig} />;
  }

  if (loading && loading) {
    return <LoadingComp txt="Validando documento..." />;
  }

  if (loadingLiveness) {
    return <LoadingComp txt="Iniciando verificação facial..." />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: routeConfig ? 16 : 0
      }}>
      <View style={{
        paddingHorizontal: routeConfig && Platform.OS === 'ios' ? 22 : 0
      }}>
        {routeConfig && <View style={styles.btnBackBlock}>
          <TouchableOpacity onPress={() => { nav.goBack() }}>
            <ArrowBack color={theme.colors.text} width={32} height={32} />
          </TouchableOpacity>
        </View>}
        <View style={routeConfig ? styles.contentPage : styles.content}>
          <Text style={{ ...styles.title, marginBottom: 24 }}>
            Validade de identidade
          </Text>
          {routeConfig ? (<Text style={styles.desc}>
            Para realizar essa operação você precisar fazer uma selfie para validarmos sua identidade.
            Em seguida precisamos que você tire uma foto frente e verso do seu RG ou CNH.
          </Text>) : (<Text style={styles.desc}>
            Agora que temos suas informações pessoais, só falta você fazer uma selfie para validarmos sua identidade.
            Em seguida precisamos que você tire uma foto frente e verso do seu RG ou CNH.
          </Text>)}

          <View style={styles.list}>
            <View style={styles.listItem}>
              <CheckIcon width={24} height={24} color={!sendLiveness ? theme.customColors.neutrals[200] : "#168941"} />
              <Text style={styles.listTxt}>
                <Text style={{ fontFamily: theme.fonts.bold }}>Tirar selfie</Text>
              </Text>
            </View>

            {!sendLiveness && (
              <View style={styles.listItem}>
                <CheckIcon width={24} height={24} color={!sendLiveness ? theme.customColors.neutrals[200] : "#168941"} />
                <Text style={styles.listTxt}>
                  <Text style={{ fontFamily: theme.fonts.bold }}>Validação de RG ou CNH</Text>
                </Text>
              </View>
            )}
          </View>

          {sendLiveness && (
            <Select
              label="Validação de RG ou CNH"
              required={true}
              placeholder="Selecione uma opção"
              value={form.documentStatus || ''}
              setValue={setForm}
              form={form}
              arr={documentsList}
              fieldName="documentStatus"
            />
          )}
        </View>
        <View style={styles.cardWarn}>
          <WarningIcon width={48} height={48} color={theme.customColors.hyperlink} />
          <View style={{ flex: 1 }}>
            <Text style={styles.warnTitle}>Lembre-se</Text>
            <Text style={styles.warnDesc}>
              É importante que a foto da selfie e documento esteja nítida para validação de sua identidade.
            </Text>
          </View>
        </View>
        {sendLiveness ? (
          <BtnDefault label="Validar documento" loading={loading} onPress={() => startDocumentDetector(mobileToken!, personId!)} style={{ marginBottom: 15 }} />
        ) : (
          <BtnDefault label="Tirar selfie" loading={loading} onPress={() => handleStartLiveness()} style={{ marginBottom: 15 }} />
        )}
        <Snack visible={showSnack} txt={error} setShowSnack={setShowSnack} />
      </View>
    </SafeAreaView >
  );
}
