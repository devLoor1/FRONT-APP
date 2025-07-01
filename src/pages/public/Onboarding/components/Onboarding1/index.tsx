import React, { useEffect } from 'react';
import { Text, ScrollView, ImageBackground, View } from 'react-native';
// import { useTranslation, Trans } from 'react-i18next';
import { useTheme } from '../../../../../context/MyThemeContext';
import { useCustomStyles } from '../../style';
import BtnIcon from '../../../../../components/BtnIcon';
import ArrowForwad from '@/../assets/newSvgs/icons/arrow_forward.svg';
import { Analytics } from '@/helpers/analytics';

type Props = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function Onboarding1({ setPage }: Props) {
  // const { t } = useTranslation();
  const styles = useCustomStyles();
  const { theme } = useTheme();

  useEffect(() => {
    Analytics({ pageName: 'EntradaApp1' });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={
          theme.dark
            ? require('@/../assets/images/onboarding1-dark.png')
            : require('@/../assets/images/onboarding1.png')
        }
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ScrollView style={{ flexGrow: 1 }}>
        {/* <Text style={styles.title}>{t('onboarding.page1.title')}</Text> */}
        <Text style={styles.title}>Comece a investir</Text>
        {/* <Text style={styles.description}>
          <Trans
            i18nKey="onboarding.page1.description"
            components={{
              highlight: <Text style={styles.highlight} />,
              newline: <Text>{'\n'}</Text>,
            }}
          />
        </Text> */}
        <Text style={styles.description}>
          Com a <Text style={styles.highlight}>Wealth Money</Text>, você pode rentabilizar seus
          investimentos acima do mercado, com total transparência e segurança. {'\n\n'}
          <Text style={styles.highlight}>Tudo isso de forma gratuita.</Text>
        </Text>
      </ScrollView>

      <BtnIcon
        style={styles.nextButton}
        width={50}
        height={50}
        bgColor={theme.colors.text}
        onPress={() => {
          Analytics({ eventName: 'EntradaApp1_OnboardSiga1' });
          setPage(2);
        }}>
        <ArrowForwad color={theme.colors.background} />
      </BtnIcon>
    </View>
  );
}
