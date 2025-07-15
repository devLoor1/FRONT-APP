import { CameraView } from 'expo-camera';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePageStyles } from './style';
import { useAppSelector } from '~/redux/hooks';
import BtnDefault from '~/components/BtnDefault';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ImageBackground, Text, View } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';
import ArrowIcon from '~/../assets/newSvgs/icons/arrow_back.svg';
import CloseIcon from '~/../assets/newSvgs/icons/close_small.svg';
import CameraIcon from '~/../assets/newSvgs/icons/photo_camera.svg';
import { Analytics } from '~/helpers/analytics';

type CameraProps = {
  takePicture(): Promise<void>;
  cameraRef: React.MutableRefObject<null>;
  capturedImage: any;
  previewVisible: boolean;
  hideRetakeIcon?: boolean
  retakePicture(): void;
  closeCamera(): void;
  onSubmitPicture(): Promise<void>;
  progress: number;
};

export default function CameraComp({
  takePicture,
  cameraRef,
  capturedImage,
  previewVisible,
  hideRetakeIcon = false,
  retakePicture,
  onSubmitPicture,
  closeCamera,
  progress,
}: CameraProps) {
  const styles = usePageStyles();
  const { theme } = useTheme();
  const { loadingDoc } = useAppSelector(state => state.register);

  useEffect(() => {
    if (previewVisible && capturedImage) {
      { Analytics({ pageName: 'CadastroResImgConfirmar' }) }
      return
    }

    { Analytics({ pageName: 'CadastroResidencia' }) }

  }, [])

  return (
    <View style={styles.container}>
      {previewVisible && capturedImage ? (
        <>
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity onPress={retakePicture} style={styles.arrow}>
              {!hideRetakeIcon && <ArrowIcon color={theme.colors.text} />}
            </TouchableOpacity>
            <View style={styles.confirmImg}>
              <View style={styles.confirmImgBody}>
                <View style={styles.blockImg}>
                  <ImageBackground
                    style={styles.img}
                    source={{ uri: capturedImage && capturedImage.uri }}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.confirmImgTxt}>Confira se as informações estão legíveis</Text>
              </View>
              <View style={styles.confirmImgFooter}>
                <BtnDefault
                  label={loadingDoc ? 'Enviando Documento...' : 'Enviar Documento'}
                  onPress={() => {
                    Analytics({ eventName: 'CadastroResImgConfirmar_Enviar' });
                    onSubmitPicture();
                  }}
                  marginBottom={8}
                  disabled={loadingDoc}
                />
                <BtnDefault
                  disabled={loadingDoc}
                  label="Tirar outra foto"
                  icon={
                    <CameraIcon
                      color={theme.customColors.secondary.default}
                      width={24}
                      height={24}
                    />
                  }
                  onPress={() => {
                    Analytics({ eventName: 'CadastroResImgConfirmar_Repetir' });
                    retakePicture();
                  }}
                  white
                />
              </View>
            </View>
          </SafeAreaView>
          {loadingDoc && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={{ ...styles.progressFill, width: `${progress}%` }} />
                <Text style={styles.barValue}>Enviando... {progress}%</Text>
              </View>
            </View>
          )}
        </>
      ) : (
        <>
          <View style={{ flex: 1 }}>
            <CameraView style={{ flex: 1, width: '100%' }} ref={cameraRef} />
            <View style={styles.ui}>
              <TouchableOpacity
                style={styles.btnTake}
                onPress={() => {
                  Analytics({ pageName: 'CadastroResidencia_TirarFoto' });
                  takePicture();
                }}>
                <View style={styles.btnTakeFill} />
              </TouchableOpacity>
            </View>
            <View style={styles.btnCancelBlock}>
              <TouchableOpacity onPress={closeCamera} style={styles.btnCancel}>
                <CloseIcon color={theme.customColors.baseWhite} width={32} height={32} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
