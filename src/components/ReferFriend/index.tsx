/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { useCustomStyles } from './style';
import BottomSheet from '../BottomSheet';
import { Share, Text, TouchableOpacity, View } from 'react-native';
import CloseIcon from '@/../assets/newSvgs/icons/close_small.svg';
import ShareIcon from '@/../assets/newSvgs/icons/share.svg';
import { useTheme } from '@/context/MyThemeContext';
import { useAppSelector } from '@/redux/hooks';
import CommonMask from '@/helpers/masks';
import { Analytics } from '@/helpers/analytics';
// import LottieView from 'lottie-react-native';

type Props = {
  refRBSheet: any;
};

export default function ReferFriend({ refRBSheet }: Props) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const [code, setCode] = useState('');
  const { recommendationStatus } = useAppSelector(state => state.recommendation);
  // const animation = require('@/../assets/animations/account.json');

  useEffect(() => {
    if (recommendationStatus) {
      if (recommendationStatus.recommendation) {
        setCode(recommendationStatus.recommendation.code);
      }
    }
  }, [recommendationStatus]);

  const shareCode = async () => {
    Analytics({ eventName: 'IndicacaoShare_CompartilharCodigo' });
    Share.share({
      message: `Conheça a Wealth Money e aproveite as melhores oportunidades. Diversifique seus investimentos com o P2P Lending e alcance rentabilidades atrativas.\n\nAbra sua conta em apenas 3 minutos, use o código ${code} e ganhe 1% de cashback durante 1 mês!\n\nhttps://Loor-dynamic-link.web.app/?invite=${code}`,
    });
  };

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      height={620}
      onOpen={() => Analytics({ pageName: 'IndicacaoShare' })}>
      <TouchableOpacity
        style={styles.close}
        onPress={() => {
          Analytics({ eventName: 'IndicacaoShare_Fechar' });
          refRBSheet.current.close();
        }}>
        <CloseIcon color={theme.customColors.baseWhite} width={24} height={24} />
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <View style={styles.content}>
          {/* <View style={{ width: 150, height: 150, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView autoPlay={true} loop={true} resizeMode="cover" source={animation} />
          </View> */}
          <Text style={styles.title}>Indique e ganhe!</Text>
          <Text style={styles.desc}>
            Ganhe{' '}
            {CommonMask.percent(
              recommendationStatus?.recommendation?.percentage.toFixed(2).toString() || '0'
            )}
            % em cashback quando alguém se inscrever usando seu código de indicação e fizer o
            primeiro investimento.
          </Text>
          <Text style={styles.codeCall}>Convide seus amigos e familiares:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>{code}</Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={shareCode}>
            <ShareIcon color={theme.customColors.baseWhite} />
            <Text style={styles.btnTxt}>Compartilhar código</Text>
          </TouchableOpacity>
          <Text style={styles.footerTxt}>
            A cada investimento realizado pelo(s) investidor(es) indicados, você receberá{' '}
            {CommonMask.percent(
              recommendationStatus?.recommendation?.percentage.toFixed(2).toString() || '0'
            )}
            % sobre o total investido em cada operação por um período de{' '}
            {recommendationStatus?.recommendation?.periodMonth} meses.
          </Text>
        </View>
      </View>
    </BottomSheet>
  );
}
