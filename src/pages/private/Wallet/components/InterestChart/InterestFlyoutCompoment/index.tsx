import moment from 'moment';
import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '~/context/MyThemeContext';
import { useCustomStyles } from './style';
import CommonMask from '~/helpers/masks';
import ArrowUp from '~/../assets/newSvgs/icons/arrow_upward_alt.svg';
import { FlyoutComponent } from '~/components/FlyoutComponent';

export const InterestFlyoutCompoment: React.FC<
  Partial<{
    chartWidth: number;
    chartHeight: number;
    x: number;
    y: number;
    data: { x: number; invested: number; interest: number };
  }>
> = ({ data, ...rest }) => {
  const { theme } = useTheme();
  const styles = useCustomStyles();

  if (!data) return null;

  return (
    <FlyoutComponent {...rest}>
      <Text style={styles.title}>
        Mês de{' '}
        {moment(data.x)
          .locale('pt')
          .format('MMMM/YYYY')
          .replace(/^./, match => match.toUpperCase())}
      </Text>
      <Text style={styles.description}>
        Principal recebido: R${' '}
        {CommonMask.currency(Number(data.invested).toFixed(2).toString() || '')}
      </Text>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>Juros: </Text>
        <ArrowUp width={12} height={12} color={theme.customColors.risk.default} />
        <Text style={styles.itemValue}>
          R$ {CommonMask.currency(Number(data.interest).toFixed(2).toString() || '')}
        </Text>
      </View>
    </FlyoutComponent>
  );
};
