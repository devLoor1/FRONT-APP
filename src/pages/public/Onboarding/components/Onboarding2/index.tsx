import React, { useEffect } from 'react';
import { Text, ScrollView, ImageBackground, View, Dimensions } from 'react-native';
import { useTheme } from '../../../../../context/MyThemeContext';
import { useCustomStyles } from '../../style';
import BtnIcon from '../../../../../components/BtnIcon';
import ArrowForwad from '@/../assets/newSvgs/icons/arrow_forward.svg';
import { Analytics } from '@/helpers/analytics';

type Props = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function Onboarding2({ setPage }: Props) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    Analytics({ pageName: 'EntradaApp2' });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={
          theme.dark
            ? require('@/../assets/images/onboarding2-dark.png')
            : require('@/../assets/images/onboarding2.png')
        }
        style={{ ...styles.backgroundImage, width: windowWidth, left: -16 }}
        resizeMode="cover"
      />
      <ScrollView style={{ flexGrow: 1 }}>
        <Text style={styles.title}>Invista e ganhe</Text>
        <Text style={styles.description}>
          A <Text style={styles.highlight}>Wealth Money</Text> permite que você adquira cotas de
          investimento em empresas com total transparência e segurança. Isso garante que você tenha
          todas as informações necessárias para tomar decisões de investimento com segurança.
        </Text>
      </ScrollView>
      <BtnIcon
        style={styles.nextButton}
        width={50}
        height={50}
        bgColor={theme.colors.text}
        onPress={() => {
          Analytics({ eventName: 'EntradaApp2_OnboardSiga2' });
          setPage(3);
        }}>
        <ArrowForwad color={theme.colors.background} />
      </BtnIcon>
    </View>
  );
}
