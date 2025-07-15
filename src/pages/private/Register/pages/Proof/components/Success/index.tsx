import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import { useCustomStyles } from './style';
import { useTheme } from '~/context/MyThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import BtnDefault from '~/components/BtnDefault';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useAuth } from '~/context/auth';
import { GetUserStatus } from '~/services/user';
import { Analytics } from '~/helpers/analytics';
import LottieView from 'lottie-react-native';

export default function SuccessPage() {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { loadingUserStatus } = useAppSelector(state => state.user);
  const { deviceToken } = useAuth();
  const animation = require('~/../assets/animations/doc.json');


  useEffect(() => {
    Analytics({ pageName: 'DocumentoSucesso' });
  }, []);

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
            label="Continuar"
            white
            onPress={() => {
              Analytics({ pageName: 'DocumentoSucesso_Continuar' });
              (async () => {
                await dispatch(GetUserStatus(deviceToken));
              })();
            }}
            loading={loadingUserStatus}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
