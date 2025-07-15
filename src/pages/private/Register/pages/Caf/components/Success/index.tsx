import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/models/routes/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
type props = {
  routeConfig?: boolean
};

export default function SuccessPage({ routeConfig = false }: props) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { loadingUserStatus } = useAppSelector(state => state.user);
  const { deviceToken } = useAuth();
  const animation = require('~/../assets/animations/doc.json');

  useEffect(() => {
    Analytics({ pageName: 'DocumentoSucesso' });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.customColors.secondary[700] }}>
      <StatusBar style="light" backgroundColor={theme.customColors.secondary[700]} />
      <LinearGradient colors={[theme.customColors.secondary[700], '#013A6A']} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.title}>Seus dados foram enviados com sucesso!</Text>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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

                if (routeConfig) {
                  nav.navigate('Tabs', { screen: 'HomeTabs' })
                  return
                }
              })();
            }}
            loading={loadingUserStatus}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>

  );
}
