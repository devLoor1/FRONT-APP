import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useCustomStyles } from './style';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '~/context/MyThemeContext';
import NeedHelp from '~/components/NeedHelp';
import { useAppSelector } from '~/redux/hooks';
import LottieView from 'lottie-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/models/routes/navigation';
import { Analytics } from '~/helpers/analytics';

export default function Banner() {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { userStatus } = useAppSelector(state => state.user);
  const animation = require('~/../assets/animations/account.json');
  const navigationTo = (route: keyof RootStackParamList) => {
    Analytics({ eventName: 'HomeApp_CompletarCadastro' })
    nav.navigate({ name: route } as any);
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => navigationTo('Register')}
    >
      <LinearGradient
        colors={[theme.customColors.secondary[700], '#013A6A']}
        style={{ borderRadius: 6 }}>
        <View style={styles.content}>
          {userStatus?.waitCaf && <Text style={styles.title}>Identidade em análise</Text>}
          {userStatus?.emptyFields.length && !userStatus?.waitCaf ? (
            <Text style={styles.title}>Complete seu cadastro</Text>
          ) : (
            <></>
          )}


          <View style={styles.row}>
            <View
              style={{ width: 150, height: 150, justifyContent: 'center', alignItems: 'center' }}>
              <LottieView
                autoPlay
                loop
                resizeMode="cover"
                style={{ width: 150, height: 150 }}
                source={animation}
              />
            </View>
              {userStatus?.emptyFields.length === 1 && userStatus.emptyFields[0] === 'Caf' ? (
                <Text style={styles.desc}>
                  Para sua segurança, precisamos da foto do seu documento e uma selfie para concluir seu cadastro.
                </Text>
              ) : userStatus?.emptyFields.length && !userStatus?.waitCaf ? (
                <View style={{ flex: 1 }}>
                  <Text style={styles.desc}>
                    Para aproveitar ao máximo todos os serviços oferecidos na nossa plataforma,{' '}
                    <Text style={{ fontFamily: theme.fonts.bold }}>complete seu cadastro</Text>.
                  </Text>
                </View>
              ) : ( 
                <Text style={styles.desc}>
                  Notificaremos quando a análise for concluída, através de mensagem em seu número de telefone cadastrado.
                </Text>
              )}
          </View>

          <NeedHelp white onPress={() => Analytics({ eventName: 'EntrarContato_Acessar' })} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
