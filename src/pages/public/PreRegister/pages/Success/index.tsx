import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import { useCustomStyles } from './style';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import BtnDefault from '@/components/BtnDefault';
import NeedHelp from '@/components/NeedHelp';
import { useTheme } from '@/context/MyThemeContext';
import ShieldIcon from '@/../assets/newSvgs/icons/verified_user.svg';
import LottieView from 'lottie-react-native';
import { Analytics } from '@/helpers/analytics';
import { Login } from '@/services/auth';
import { useAppDispatch } from '@/redux/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  resetAll(): void;
};

export default function SuccessPage({ resetAll }: Props) {
  const styles = useCustomStyles();
  const nav = useNavigation();
  const { theme } = useTheme();
  const animation = require('@/../assets/animations/Confetti.json');
  const dispatch = useAppDispatch();


  useEffect(() => {
    Analytics({ pageName: 'CadastroValidacao' });
  }, []);

  async function handleSingIn() {
    const email = await AsyncStorage.getItem('userEmailLogin');
    const password = await AsyncStorage.getItem('userPasswordLogin');

    await dispatch(
      Login({
        grantType: 'password',
        identifier: email!,
        password: password!,
        scopes:
          'signup.api, mfa.api, member.api, agreements.api, loan.api, kyc.api, investment.api, payment.api',
      })
    );

    await AsyncStorage.multiRemove(['userEmailLogin', 'userPasswordLogin']);
  }

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
            <Text style={styles.title}>Você está quase lá!</Text>
            <Text style={{ ...styles.desc, fontSize: 18 }}>
              Seu acesso está liberado, e nesse momento estamos analisando seus dados para abertura
              de conta.
            </Text>
            <Text style={{ ...styles.desc, fontFamily: theme.fonts.regular }}>
              Não se preocupe, estamos finalizando as verificações necessárias, e em breve você
              poderá aproveitar todos os serviços oferecidos em nosso aplicativo.
            </Text>
            <Text style={styles.desc}>Agradecemos pela sua paciência!</Text>
            <View style={{ marginTop: 24, alignItems: 'center' }}>
              <ShieldIcon color={theme.customColors.baseWhite} />
            </View>
          </View>
          <View style={styles.footer}>
            <BtnDefault
              label="Entrar"
              white
              onPress={() => {
                Analytics({ eventName: 'CadastroValidacao_HomeLogin' });
                resetAll();
                // nav.navigate('Login' as never);
                handleSingIn()

              }}
            />
            <View style={{ alignItems: 'center' }}>
              <NeedHelp
                white
                preRegister
                marginTop={16}
                onPress={() => {
                  Analytics({ eventName: 'CadastroValidacao_PrecisaDeAjuda' });
                  // resetAll();
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
