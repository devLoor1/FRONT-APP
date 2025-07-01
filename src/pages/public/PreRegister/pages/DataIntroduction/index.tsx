import { View, Text, BackHandler, Platform } from 'react-native';
import React, { useEffect } from 'react';
import BtnDefault from '@/components/BtnDefault';
import { useCustomStyles } from '../../style';
import { Analytics } from '@/helpers/analytics';
import { useNavigation } from '@react-navigation/native';

type Props = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function DataIntroduction({ setPage }: Props) {
  const styles = useCustomStyles();
  const navigation = useNavigation();

  useEffect(() => {
    Analytics({ pageName: 'CadastroSeusDados' });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    navigation.setOptions?.({
      gestureEnabled: false,
      headerLeft: () => null,
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <>
      <View style={{ flexGrow: 1 }}>
        <Text style={styles.title}>Seus dados</Text>
        <Text style={{ ...styles.desc, marginBottom: 24 }}>
          Para acessar a plataforma, é necessário preencher os seguintes dados: nome completo,
          e-mail, CPF e data de nascimento.
        </Text>
        <Text style={{ ...styles.desc, marginBottom: 24 }}>
          Solicitamos seu nome completo, e-mail, CPF e data de nascimento para garantir uma
          experiência segura e personalizada na plataforma.
        </Text>
        <Text style={styles.subDesc}>
          Esses dados são protegidos de acordo com a legislação vigente e são fundamentais para
          garantir sua segurança e uma melhor experiência na plataforma.
        </Text>
      </View>
      <BtnDefault
        style={{ marginBottom: Platform.OS === 'android' ? 20 : 0 }}
        label="Continuar"
        onPress={() => {
          Analytics({ eventName: 'CadastroSeusDados_Continuar' });
          setPage(4);
        }}
      />
    </>
  );
}
