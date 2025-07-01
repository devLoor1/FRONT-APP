import React, { useEffect } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { useTheme } from '../../../../../context/MyThemeContext';
import { useCustomStyles } from '../../style';
import BtnIcon from '../../../../../components/BtnIcon';
import ArrowForwad from '@/../assets/newSvgs/icons/arrow_forward.svg';
import { Analytics } from '@/helpers/analytics';

type Props = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function Onboarding3({ setPage }: Props) {
  const styles = useCustomStyles();
  const { theme } = useTheme();

  useEffect(() => {
    Analytics({ pageName: 'EntradaApp3' });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flexGrow: 1 }}>
        <Text style={styles.title}>Crie sua Conta</Text>
        <Text style={styles.description}>
          Criar uma conta na <Text style={styles.highlight}>Wealth Money</Text> é simples, rápido e
          gratuito. {'\n\n'} Se preferir, conte com a nossa equipe de assessores para orientar em
          cada etapa do seu investimento.
        </Text>
        <Text style={styles.title2}>100% Gratuito</Text>
        <Text style={styles.description}>
          Veja nossas oportunidades e invista na que mais se adéque ao seu perfil!
        </Text>
      </ScrollView>
      <BtnIcon
        style={styles.nextButton}
        width={50}
        height={50}
        bgColor={theme.colors.text}
        onPress={() => {
          Analytics({ eventName: 'EntradaApp3_OnboardSiga3' });
          setPage(4);
        }}>
        <ArrowForwad color={theme.colors.background} />
      </BtnIcon>
    </View>
  );
}
