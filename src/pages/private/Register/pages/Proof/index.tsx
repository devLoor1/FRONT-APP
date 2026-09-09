import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import Snack from '@/components/Snack';
import CameraComp from './components/Camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View } from 'react-native';
import SuccessPage from './components/Success';
import { useCustomStyles } from '../../style';
import { useTheme } from '@/context/MyThemeContext';
import { usePageStyles } from './style';
import BtnDefault from '@/components/BtnDefault';
import InfoIcon from '@/../assets/newSvgs/icons/info.svg';
import WarningIcon from '@/../assets/newSvgs/icons/warning.svg';
import CameraIcon from '@/../assets/newSvgs/icons/photo_camera.svg';
import { Analytics } from '@/helpers/analytics';
import { safeLogger } from '@/helpers/observability';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ArrowBack from '@/../assets/newSvgs/icons/arrow_back.svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models/routes/navigation.private';
import { submitFaceMatch } from '@/services/user';
import { useMutation } from '@tanstack/react-query';
import LoadingComp from '@/components/Loading';
import type { FaceMatchStatus } from '@/models/user/me.response';

type Props = {
  onActionAfterSubmit?: (docResponse: any) => void
  hideRetakeIcon?: boolean
  onContinue?: () => void;
};

type PhotoType = 'document' | 'selfie';

export default function Proof({ onActionAfterSubmit, hideRetakeIcon = false, onContinue }: Props) {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const styles = useCustomStyles();
  const pageStyles = usePageStyles();
  const { theme } = useTheme();
  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const cameraRef = useRef<any>(null);
  const [isOpenCamera, setIsOpenCamera] = React.useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState<PhotoType>('document');
  const [documentPhoto, setDocumentPhoto] = useState<any>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [submittedStatus, setSubmittedStatus] = useState<FaceMatchStatus | null>(null);

  const {
    mutateAsync: faceMatchMutation,
    isPending: isSubmitting,
  } = useMutation({
    mutationKey: ['submitFaceMatch'],
    mutationFn: ({ document, selfie }: { document: any; selfie: any }) => submitFaceMatch(document, selfie),
  });

  async function startCamera(photoType: PhotoType) {
    Analytics({ pageName: 'ComprovanteResidencia_TirarFoto' });
    const { status } = await Camera.requestCameraPermissionsAsync();

    if (status === 'granted') {
      setCurrentPhotoType(photoType);
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
      if (currentPhotoType === 'document') {
        setDocumentPhoto(photo);
      } else {
        setSelfiePhoto(photo);
      }
      setIsOpenCamera(false);
    }
  }

  function retakePicture(photoType: PhotoType) {
    if (photoType === 'document') {
      setDocumentPhoto(null);
    } else {
      setSelfiePhoto(null);
    }
    startCamera(photoType);
  }

  async function onSubmitPictures() {
    if (!documentPhoto || !selfiePhoto) {
      setSnackMessage('É necessário capturar tanto o documento quanto a selfie');
      setShowSnack(true);
      return;
    }

    try {
      const response = await faceMatchMutation({ document: documentPhoto, selfie: selfiePhoto });
      const status = response.data.status as FaceMatchStatus;

      if (status === 'refused_by_api') {
        setSnackMessage('Não foi possível validar as imagens. Tire novas fotos e tente novamente.');
        setShowSnack(true);
        return;
      }

      setSubmittedStatus(status);

      if (onActionAfterSubmit) {
        await onActionAfterSubmit({ success: true, status });
      }
    } catch (error: any) {
      safeLogger.error('Face match upload failed', error);
      const errorMessage = error?.response?.data?.message || 'Erro ao enviar fotos. Tente novamente.';
      setSnackMessage(errorMessage);
      setShowSnack(true);
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'CadastroComprovante' });
  }, []);

  if (isOpenCamera) {
    return (
      <CameraComp
        takePicture={takePicture}
        cameraRef={cameraRef}
        capturedImage={currentPhotoType === 'document' ? documentPhoto : selfiePhoto}
        previewVisible={false}
        retakePicture={() => {
          retakePicture(currentPhotoType);
        }}
        onSubmitPicture={async () => {}}
        closeCamera={closeCamera}
        progress={progress}
        hideRetakeIcon={hideRetakeIcon}
        isLoading={isSubmitting}
      />
    );
  }

  if (submittedStatus) {
    return <SuccessPage status={submittedStatus} onContinue={onContinue} />;
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
              Validação de identidade
            </Text>
            <Text style={pageStyles.desc}>
              Envie uma foto nítida do seu documento de identificação e uma selfie.
            </Text>
            <View style={pageStyles.list}>
              <View style={pageStyles.listItem}>
                <InfoIcon width={24} height={24} color={theme.customColors.hyperlink} />
                <Text style={pageStyles.listTxt}>
                  <Text style={{ fontFamily: theme.fonts.bold }}>Nome completo:</Text> deve estar
                  legível no documento.
                </Text>
              </View>
              <View style={pageStyles.listItem}>
                <InfoIcon width={24} height={24} color={theme.customColors.hyperlink} />
                <Text style={pageStyles.listTxt}>
                  <Text style={{ fontFamily: theme.fonts.bold }}>CPF e data de nascimento:</Text>{' '}
                  precisam estar visíveis para a conferência de identidade.
                </Text>
              </View>
              <View style={pageStyles.listItem}>
                <InfoIcon width={24} height={24} color={theme.customColors.hyperlink} />
                <Text style={pageStyles.listTxt}>
                  <Text style={{ fontFamily: theme.fonts.bold }}>Imagem completa:</Text> não corte
                  bordas nem cubra informações do documento.
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

          {/* Documento */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontFamily: theme.fonts.semiBold, color: theme.colors.text, marginBottom: 8 }}>Documento de identificação</Text>
            {documentPhoto ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ 
                  width: 60, 
                  height: 60, 
                  backgroundColor: theme.colors.border, 
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{ fontSize: 12, color: theme.colors.text }}>✓</Text>
                </View>
                <BtnDefault
                  label="Nova foto"
                  white
                  onPress={() => retakePicture('document')}
                  style={{ flex: 1 }}
                />
              </View>
            ) : (
              <BtnDefault
                label="Tirar foto do documento"
                icon={<CameraIcon color={theme.customColors.baseWhite} width={24} height={24} />}
                onPress={() => startCamera('document')}
              />
            )}
          </View>

          {/* Selfie */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontFamily: theme.fonts.semiBold, color: theme.colors.text, marginBottom: 8 }}>Selfie</Text>
            {selfiePhoto ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ 
                  width: 60, 
                  height: 60, 
                  backgroundColor: theme.colors.border, 
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{ fontSize: 12, color: theme.colors.text }}>✓</Text>
                </View>
                <BtnDefault
                  label="Nova foto"
                  white
                  onPress={() => retakePicture('selfie')}
                  style={{ flex: 1 }}
                />
              </View>
            ) : (
              <BtnDefault
                label="Tirar selfie"
                icon={<CameraIcon color={theme.customColors.baseWhite} width={24} height={24} />}
                onPress={() => startCamera('selfie')}
              />
            )}
          </View>

          {/* Botão de enviar */}
          {documentPhoto && selfiePhoto && (
            <BtnDefault
              label={isSubmitting ? "Enviando..." : "Enviar fotos"}
              onPress={onSubmitPictures}
              disabled={isSubmitting}
            />
          )}
        </View>
        
        {isSubmitting && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
          }}>
            <LoadingComp transparent />
          </View>
        )}
        
        <Snack visible={showSnack} txt={snackMessage} setShowSnack={setShowSnack} />
      </ScrollView>
    </SafeAreaView>
  );
}
