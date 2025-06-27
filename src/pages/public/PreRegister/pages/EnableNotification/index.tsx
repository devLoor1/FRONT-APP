import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import BtnDefault from '~/components/BtnDefault';
import { useCustomStyles } from '../../style';
import { Analytics } from '~/helpers/analytics';

type Props = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function EnableNotification({ setPage }: Props) {
  const styles = useCustomStyles();

  useEffect(() => {
    Analytics({ pageName: 'CadNotifPush' });
  }, []);

  return (
    <>
      <View style={{ flexGrow: 1, paddingTop: 48 }}>
        <Text style={styles.title}>Não perca seus alertas</Text>
        <Text style={{ ...styles.desc, marginBottom: 24 }}>
          Seja notificado sobre investimentos, oportunidades, segurança, movimentações,
          recebimentos, pagamentos, descontos e promoções, para estar sempre informado.
        </Text>
      </View>
      <BtnDefault
        label="Ativar notificações via push"
        marginBottom={8}
        onPress={() => {
          Analytics({ eventName: 'CadNotifPush_Habilitar_Continuar' });
          setPage(8);
        }}
      />
      <BtnDefault
        label="Agora Não"
        white
        onPress={() => {
          Analytics({ eventName: 'CadNotifPush_Cancelar' });
          setPage(8);
        }}
      />
    </>
  );
}
