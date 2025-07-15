import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useCustomStyles } from './style';
import BtnDefault from '../../../../../components/BtnDefault';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '~/context/MyThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { reset } from '~/redux/reducers/payment';
import { useAppDispatch } from '~/redux/hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/models/routes/navigation';
import LottieView from 'lottie-react-native';
import { Analytics } from '~/helpers/analytics';
import { resetInvest } from '~/redux/reducers/opportunities';
import { resetBiometric } from '~/redux/reducers/authBiometric';
import AvaliationBottomSheet from '~/components/AvaliationBottomSheet';
import RBSheet from 'react-native-raw-bottom-sheet';
import { GetAvaliationStatus } from '~/services/avaliation';
import { useAppSelector } from '~/redux/hooks';


export default function SuccessPage() {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const animation = require('~/../assets/animations/Confetti.json');
  const AvaliationBottomSheetRef = useRef<RBSheet>(null);
  const { allowed } = useAppSelector(state => state.avaliation);

  useEffect(() => {
    Analytics({ pageName: 'InvestirATSucesso' });

  }, []);

  useEffect(() => {
    dispatch(GetAvaliationStatus());
  }, []);

  useEffect(() => {
    if (allowed === true) {
      AvaliationBottomSheetRef.current?.open();
    }
  }, [allowed]);

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
            <Text style={styles.title}>Investimento realizado com sucesso!</Text>
            <Text style={styles.desc}>
              Assim que o investimento for processado, você receberá uma notificação.
            </Text>
          </View>
          <View style={styles.footer}>
            <BtnDefault
              label="Voltar para oportunidades"
              onPress={() => {
                Analytics({ eventName: 'InvestirATSucesso_MenuOportunidades' });
                dispatch(reset());
                dispatch(resetInvest());
                dispatch(resetBiometric());
                nav.navigate('InvestTabs' as never);
              }}
              marginBottom={8}
            />
            <BtnDefault
              label="Ver meus investimentos"
              onPress={() => {
                Analytics({ eventName: 'InvestirATSucesso_MenuMeusInvestimentos' });
                dispatch(reset());
                dispatch(resetInvest());
                dispatch(resetBiometric());
                nav.navigate('Tabs', { screen: 'InvestmentTabs' });
              }}
              white
            />
          </View>
        </View>
      </SafeAreaView>
      <AvaliationBottomSheet refRBSheet={AvaliationBottomSheetRef} />
    </LinearGradient>
  );
}
