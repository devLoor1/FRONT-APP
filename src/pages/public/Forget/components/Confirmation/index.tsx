import React, { useEffect } from 'react';
import BtnDefault from '@/components/BtnDefault';
import { Analytics } from '@/helpers/analytics';
import { useCustomStyles } from './style';
import { useTheme } from '@/context/MyThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

type ConfirmationProps = {
  confirmRegister(): void;
};

export default function ConfirmationPage({ confirmRegister }: ConfirmationProps) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const animation = require('@/../assets/animations/ok-anima-v2.json');

  useEffect(() => {
    Analytics({ pageName: 'EsqueceuSenhaSucesso' });
  }, []);

  return (
    <LinearGradient colors={[theme?.customColors?.secondary?.[700] || '#013A6A', '#013A6A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.title}>Email enviado com sucesso!</Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View
                style={{ width: 250, height: 250, justifyContent: 'center', alignItems: 'center' }}>
                <LottieView
                  autoPlay={true}
                  loop={true}
                  style={{ width: 250, height: 250 }}
                  resizeMode="cover"
                  source={animation}
                />
              </View>
            </View>
            <Text style={styles.desc}>
              Enviamos um link para redefinir sua senha no email informado. 
              Verifique sua caixa de entrada e siga as instruções.
            </Text>
          </View>
          <View style={styles.footer}>
            <BtnDefault
              label="Entrar"
              white
              onPress={() => {
                Analytics({ eventName: 'EsqueceuSenhaSucesso_Continuar' });
                confirmRegister();
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
