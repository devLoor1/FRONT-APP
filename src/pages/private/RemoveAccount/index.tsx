import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import HeaderDefault from '../../../components/HeaderDefault';
import { useCustomStyles } from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeleteIcon from '@/../assets/newSvgs/icons/Delete.svg';
import { useTheme } from '@/context/MyThemeContext';
import BtnDefault from '@/components/BtnDefault';
import LoadingComp from '@/components/Loading';
import { Analytics } from '@/helpers/analytics';
import { deleteInvestor } from '@/services/auth';
import { useAuth } from '@/context/auth';
import { useMutation } from '@tanstack/react-query';
import Snack from '@/components/Snack';

export default function CloseAccountPage() {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { onSignOut } = useAuth();
  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const {
    mutateAsync: deleteInvestorMutation,
    isPending: deleteLoading,
  } = useMutation({
    mutationKey: ['deleteInvestor'],
    mutationFn: deleteInvestor,
  });

  useEffect(() => {
    Analytics({ pageName: 'MeuPerfilEncerrarConta' });
  }, []);

  const closeAccount = async () => {
    try {
      Analytics({ eventName: 'MeuPerfilEncerrarConta_AbrirSolicitacaoEmail' });
      
      await deleteInvestorMutation();
      
      await onSignOut();
    } catch (error: any) {
      let errorMessage = 'Erro ao encerrar conta. Tente novamente.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setSnackMessage(errorMessage);
      setShowSnack(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderDefault back title="Minha Conta" analytics="MeuPerfilEncerrarConta" />
      {deleteLoading ? (
        <LoadingComp transparent />
      ) : (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
              <View style={styles.head}>
                <View style={styles.headIcon}>
                  <DeleteIcon color={theme.colors.text} width={42} height={42} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.headName}>Encerrar conta</Text>
                  <Text style={styles.headDesc}>
                    Ao excluir sua conta, todos os seus dados serão permanentemente removidos
                  </Text>
                </View>
              </View>
              
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <BtnDefault
              label={deleteLoading ? "Encerrando..." : "Encerrar conta"}
              onPress={closeAccount}
              bg={theme.customColors.error[300]}
              disabled={deleteLoading}
            />
          </View>
        </SafeAreaView>
      )}
      <Snack
        visible={showSnack}
        txt={snackMessage}
        setShowSnack={setShowSnack}
        type="error"
        duration={5000}
      />
    </View>
  );
}
