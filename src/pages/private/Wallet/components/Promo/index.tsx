import React from 'react';
import { useCustomStyles } from './style';
import BannerIndicar from '~/../assets/images/BannerIndicar.png';
import { Image, Text, View } from 'react-native';
import { useTheme } from '~/context/MyThemeContext';
import BtnDefault from '~/components/BtnDefault';
import { Analytics } from '~/helpers/analytics';

type Props = {
  refRBSheet: any;
};

export default function PromoComponent({ refRBSheet }: Props) {
  const styles = useCustomStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={BannerIndicar} style={{ width: '100%' }} />
        <View style={styles.blockTxt}>
          <Text style={styles.desc}>
            Este Natal, <Text style={{ fontFamily: theme.fonts.bold }}>Wealth Money</Text> tem um
            presente especial para você:{' '}
            <Text style={{ fontFamily: theme.fonts.bold }}>
              Indique seus amigos e compartilhe R$200 em bônus!
            </Text>
            {'\n'}
          </Text>
          <Text style={styles.desc}>
            Porque o fim de ano é sobre celebrar, compartilhar e construir juntos!
            {'\n'}
          </Text>
          <Text style={styles.desc}>Convide agora e espalhe o espírito do final de ano!</Text>
          <Text style={styles.validity}>Promoção válida até 31/12</Text>
          <BtnDefault
            label="Compartilhe seu código promocional"
            bg={theme.customColors.secondary[600]}
            onPress={() => {
              Analytics({ eventName: 'HomeApp_IndiqueAmigo' });
              refRBSheet.current.open();
            }}
          />
        </View>
      </View>
    </View>
  );
}
