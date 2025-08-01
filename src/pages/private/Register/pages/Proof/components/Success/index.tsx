import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import { useCustomStyles } from './style';
import { useTheme } from '@/context/MyThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import BtnDefault from '@/components/BtnDefault';
import { useAppDispatch } from '@/redux/hooks';
import { Analytics } from '@/helpers/analytics';
import LottieView from 'lottie-react-native';
import { getMe } from '@/services/user';
import { useMutation } from '@tanstack/react-query';

type SuccessPageProps = {
  onContinue?: () => void;
};

export default function SuccessPage({ onContinue }: SuccessPageProps) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const animation = require('@/../assets/animations/doc.json');

  const {
    mutateAsync: getMeMutation,
    isPending: loadingGetMe,
  } = useMutation({
    mutationKey: ['getMe'],
    mutationFn: getMe,
  });

  useEffect(() => {
    Analytics({ pageName: 'DocumentoSucesso' });
  }, []);

  const handleContinue = async () => {
    Analytics({ pageName: 'DocumentoSucesso_Continuar' });
    
    try {
      await getMeMutation();
      onContinue?.();
    } catch (error: any) {
      onContinue?.();
    }
  };

  return ( 
    <LinearGradient colors={[theme.customColors.secondary[700], '#013A6A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.title}>Seu documento foi enviado com sucesso!</Text>
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
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
