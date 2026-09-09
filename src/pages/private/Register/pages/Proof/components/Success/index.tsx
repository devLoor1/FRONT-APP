import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useCustomStyles } from './style';
import { useTheme } from '@/context/MyThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import BtnDefault from '@/components/BtnDefault';
import { useAppDispatch } from '@/redux/hooks';
import { Analytics } from '@/helpers/analytics';
import LottieView from 'lottie-react-native';
import { fetchUserData } from '@/redux/reducers/auth';
import type { FaceMatchStatus } from '@/models/user/me.response';
import Snack from '@/components/Snack';
import { safeLogger } from '@/helpers/observability';

type SuccessPageProps = {
  onContinue?: () => void;
  status: FaceMatchStatus;
};

export default function SuccessPage({ onContinue, status }: SuccessPageProps) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const animation = require('@/../assets/animations/doc.json');
  const [loadingGetMe, setLoadingGetMe] = useState(false);
  const [showSnack, setShowSnack] = useState(false);

  useEffect(() => {
    Analytics({ pageName: 'DocumentoSucesso' });
  }, []);

  const handleContinue = async () => {
    Analytics({ pageName: 'DocumentoSucesso_Continuar' });

    try {
      setLoadingGetMe(true);
      await dispatch(fetchUserData()).unwrap();
      onContinue?.();
    } catch (error) {
      safeLogger.error('Unable to refresh investor status after face match', error);
      setShowSnack(true);
    } finally {
      setLoadingGetMe(false);
    }
  };

  return ( 
    <LinearGradient colors={[theme.customColors.secondary[700], '#013A6A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.title}>
              {status === 'approved'
                ? 'Sua identidade foi validada!'
                : 'Suas imagens foram enviadas para análise!'}
            </Text>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <View
                style={{ width: 350, height: 350, justifyContent: 'center', alignItems: 'center' }}>
                <LottieView
                  autoPlay={true} 
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                  source={animation}
                />
              </View>
            </View>
          </View>
          <BtnDefault 
            label={loadingGetMe ? "Verificando..." : "Continuar"}
            white
            onPress={handleContinue}
            loading={loadingGetMe}
          />
          <Snack
            visible={showSnack}
            setShowSnack={setShowSnack}
            txt="Não foi possível atualizar seu status. Tente novamente."
            type="error"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
