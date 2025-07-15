import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import Snack from '~/components/Snack';
import CameraComp from './components/Camera';
import { UploadDoc, VerifyDoc } from '~/services/register';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View } from 'react-native';
import SuccessPage from './components/Success';
import { useCustomStyles } from '../../style';
import { useTheme } from '~/context/MyThemeContext';
import { usePageStyles } from './style';
import BtnDefault from '~/components/BtnDefault';
import InfoIcon from '~/../assets/newSvgs/icons/info.svg';
import WarningIcon from '~/../assets/newSvgs/icons/warning.svg';
import CameraIcon from '~/../assets/newSvgs/icons/photo_camera.svg';
import AddIcon from '~/../assets/newSvgs/icons/add.svg';
import { Analytics } from '~/helpers/analytics';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ArrowBack from '~/../assets/newSvgs/icons/arrow_back.svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/models/routes/navigation';

type Props = {
  onActionAfterSubmit?: (docResponse: any) => void
  hideRetakeIcon?: boolean
};

export default function Proof({ onActionAfterSubmit, hideRetakeIcon = false }: Props) {
  const dispatch = useAppDispatch();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const styles = useCustomStyles();
  const pageStyles = usePageStyles();
  const { theme } = useTheme();
  const { requestError, docResponse, docStatus } = useAppSelector(state => state.register);
  const [showSnack, setShowSnack] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const [isOpenCamera, setIsOpenCamera] = React.useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  async function startCamera() {
    Analytics({ pageName: 'ComprovanteResidencia_TirarFoto' });
    const { status } = await Camera.requestCameraPermissionsAsync();

    if (status === 'granted') {
      setIsOpenCamera(true);
    } else {
      await Camera.requestCameraPermissionsAsync();
    }
  }

  function closeCamera() {
    setIsOpenCamera(false);
  }

  async function takePicture() {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ base64: false });

    if (photo) {
      setPreviewVisible(true);
      setCapturedImage(photo);
    }
  }

  function retakePicture() {
    startCamera();
    setCapturedImage(null);
    setPreviewVisible(false);
  }

  async function onSubmitPicture() {
    const fileName = capturedImage.uri.split('/').pop();

    const formData = new FormData();
    formData.append('file', {
      uri: capturedImage.uri,
      type: 'image/jpeg',
      name: fileName,
    } as any);

    await dispatch(UploadDoc({ request: formData, setProgress }));
    if (onActionAfterSubmit) {
      await onActionAfterSubmit(docResponse);
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'CadastroComprovante' });
  }, []);

  useEffect(() => {
    if (docResponse) {
      (async () => {
        await dispatch(VerifyDoc());
      })();
    }
  }, [docResponse]);

  useEffect(() => {
    if (docStatus) {
      setIsOpenCamera(false);
    }
  }, [docStatus]);

  useEffect(() => {
    if (requestError) {
      setShowSnack(true);
    }
  }, [requestError]);

  if (isOpenCamera) {
    return (
      <CameraComp
        takePicture={takePicture}
        cameraRef={cameraRef}
        capturedImage={capturedImage}
        previewVisible={previewVisible}
        retakePicture={retakePicture}
        onSubmitPicture={onSubmitPicture}
        closeCamera={closeCamera}
        progress={progress}
        hideRetakeIcon={hideRetakeIcon}
      />
    );
  }

  if (previewVisible && capturedImage && docStatus) {
    return <SuccessPage />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <View style={styles.btnBackBlock}>
        <TouchableOpacity onPress={() => { nav.navigate('Tabs', { screen: 'HomeTabs' }); }} style={styles.btnCancel}>
          <ArrowBack color={theme.colors.text} width={32} height={32} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[styles.container, styles.containerForm]}>
          <View style={styles.content}>
            <Text style={{ ...styles.title, marginBottom: 24 }}>
              Comprovante de Residência
            </Text>
            <Text style={pageStyles.desc}>O comprovante deve possuir:</Text>
            <View style={pageStyles.list}>
              <View style={pageStyles.listItem}>
                <InfoIcon width={24} height={24} color={theme.customColors.hyperlink} />
                <Text style={pageStyles.listTxt}>
                  <Text style={{ fontFamily: theme.fonts.bold }}>Nome completo:</Text> de sua
                  titularidade ou parentesco de primeiro grau (pai, mãe ou cônjuge).
                </Text>
              </View>
              <View style={pageStyles.listItem}>
                <InfoIcon width={24} height={24} color={theme.customColors.hyperlink} />
                <Text style={pageStyles.listTxt}>
                  <Text style={{ fontFamily: theme.fonts.bold }}>Data de validade:</Text> até no
                  máximo 3 meses desde a data de hoje.
                </Text>
              </View>
              <View style={pageStyles.listItem}>
                <InfoIcon width={24} height={24} color={theme.customColors.hyperlink} />
                <Text style={pageStyles.listTxt}>
                  <Text style={{ fontFamily: theme.fonts.bold }}>Endereço:</Text> a descrição do
                  endereço precisa estar visível.
                </Text>
              </View>
            </View>
            <View style={pageStyles.cardWarn}>
              <WarningIcon width={48} height={48} color={theme.customColors.hyperlink} />
              <View style={{ flex: 1 }}>
                <Text style={pageStyles.warnTitle}>Lembre-se</Text>
                <Text style={pageStyles.warnDesc}>
                  É importante que a foto do documento esteja nítida
                </Text>
              </View>
            </View>
          </View>

          <BtnDefault
            label="Tirar foto"
            icon={<CameraIcon color={theme.customColors.baseWhite} width={24} height={24} />}
            // marginBottom={8}
            onPress={startCamera}
          />

          {/* <BtnDefault
            label="Anexar comprovante"
            white
            icon={<AddIcon color={theme.customColors.secondary.default} />}
            onPress={() => {
              Analytics({ eventName: 'ComprovanteResidencia_AnexarComprovante' });
              setActiveCamera(true);
            }}
          /> */}
        </View>
        <Snack visible={showSnack} txt={requestError} setShowSnack={setShowSnack} />
      </ScrollView>
    </SafeAreaView>
  );
}
