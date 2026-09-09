import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import { useCustomStyles } from './style';
import BtnDefault from '../../../../../components/BtnDefault';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/MyThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import LottieView from 'lottie-react-native';
import { Analytics } from '@/helpers/analytics';
import { fetchUserData } from '@/redux/reducers/auth';
import { getInvestorAccessStage } from '@/features/investor-access/investorAccess';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models/routes/navigation.private';
import { useAuth } from '@/context/auth';
import Snack from '@/components/Snack';
import { safeLogger } from '@/helpers/observability';
import { useState } from 'react';

export default function SuccessPage() {
  const styles = useCustomStyles();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { user, loadingUser } = useAppSelector(state => state.auth);
  const { onSignOut, logoutLoading } = useAuth();
  const [showSnack, setShowSnack] = useState(false);
  const animation = require('@/../assets/animations/Confetti.json');
  const isDenied = user?.account_validation_status === 'denied';
  const isFaceMatchPending = user?.face_match?.status === 'waiting_admin_validation';

  const title = isDenied
    ? 'Não foi possível liberar sua conta'
    : 'Cadastro enviado para análise';

  const description = isDenied
    ? user?.reason_for_deny || 'Confira seus dados e entre em contato com o suporte para obter ajuda.'
    : isFaceMatchPending
      ? 'Sua identidade e seus dados cadastrais estão em análise. A carteira será liberada somente após a aprovação.'
      : 'Seus dados cadastrais estão em análise. A carteira será liberada somente após a aprovação.';

  useEffect(() => {
    Analytics({ pageName: 'CadastroSucesso' });
  }, []);

  const refreshStatus = async () => {
    try {
      const updatedUser = await dispatch(fetchUserData()).unwrap();
      if (getInvestorAccessStage(updatedUser) === 'ready') {
        nav.reset({ index: 0, routes: [{ name: 'Tabs' }] });
      }
    } catch (error) {
      safeLogger.error('Unable to refresh investor account status', error);
      setShowSnack(true);
    }
  };

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
            <Text style={styles.title}>{isDenied ? 'Atenção' : 'Tudo certo!'}</Text>
            <Text style={styles.subTitle}>{title}</Text>
            <Text style={styles.desc}>{description}</Text>
            {!isDenied && (
              <Text style={styles.happyTxt}>
                Você pode voltar a esta tela para consultar o andamento.
              </Text>
            )}
          </View>
          <BtnDefault
            label="Atualizar status"
            white
            loading={loadingUser}
            disabled={loadingUser || logoutLoading}
            onPress={() => {
              Analytics({ eventName: 'CadastroSucesso_Continuar' });
              refreshStatus();
            }}
            marginBottom={10}
          />
          <BtnDefault
            label="Sair"
            white
            loading={logoutLoading}
            disabled={loadingUser || logoutLoading}
            onPress={onSignOut}
            marginBottom={10}
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
