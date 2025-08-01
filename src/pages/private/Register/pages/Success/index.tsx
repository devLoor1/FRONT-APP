import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import { useCustomStyles } from './style';
import BtnDefault from '../../../../../components/BtnDefault';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/MyThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector } from '@/redux/hooks';
import LottieView from 'lottie-react-native';
import { Analytics } from '@/helpers/analytics';

export default function SuccessPage() {
  const styles = useCustomStyles();
  const nav = useNavigation();
  const { theme } = useTheme();
  const { loadingUserStatus } = useAppSelector(state => state.user);
  const animation = require('@/../assets/animations/Confetti.json');

  useEffect(() => {
    Analytics({ pageName: 'CadastroSucesso' });
  }, []);

  return (
    <LinearGradient colors={[theme.customColors.secondary[700], '#013A6A']} style={{ flex: 1 }}>
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
        }}>
        <LottieView
          autoPlay={true}
          loop={true}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          source={animation}
        />
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.title}>Parabéns!</Text>
            <Text style={styles.subTitle}>Seu Cadastro foi Concluído com Sucesso!</Text>
            <Text style={styles.desc}>
              A partir de agora, você tem acesso total à sua carteira, oportunidades de investimento
              e a todas as funcionalidades da nossa plataforma.
            </Text>
            <Text style={styles.desc}>
              Explore, gerencie seus ativos e aproveite ao máximo tudo o que preparamos para você.
            </Text>
            <Text style={styles.happyTxt}>Estamos felizes em ter você conosco.</Text>
          </View>
          <BtnDefault
            label="Continuar"
            white
            loading={loadingUserStatus}
            onPress={() => {
              Analytics({ eventName: 'CadastroSucesso_Continuar' });
              (async () => {
                await nav.navigate('Tabs' as never);
              })();
            }}
            marginBottom={10}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
