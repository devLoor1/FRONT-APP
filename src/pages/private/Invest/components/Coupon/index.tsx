import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useCustomStyles } from './style';
import BottomSheet from '../../../../../components/BottomSheet';
import BtnIcon from '../../../../../components/BtnIcon';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Input from '../../../../../components/Input';
import { useTheme } from '~/context/MyThemeContext';

type Props = {
  refRBSheet: any;
};

export default function Coupon({ refRBSheet }: Props) {
  const { theme } = useTheme();
  const styles = useCustomStyles();
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [showRules, setShowRules] = useState(false);

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      height={450}
      draggable={false}
      background={theme.dark ? theme.customColors.neutrals[800] : '#fff'}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headTitle}>Cupom</Text>
          {/* <BtnIcon
            style={styles.btnClose}
            width={28}
            height={28}
            bgColor={theme.customColors.baseWhite}
            onPress={() => refRBSheet.current.close()}>
            <Icon name="close" size={12} color={theme.customColors.baseBlack} />
          </BtnIcon> */}
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.titleBlock}>
            {/* <Icon
              name="wallet-giftcard"
              size={24}
              color={theme.customColors.neutrals[300]}
            /> */}
            <Text
              style={{
                ...styles.title,
                color: theme.customColors.neutrals[300],
              }}>
              Não existem cupons nesse momento.
            </Text>
          </View>
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.inputTitle}>Tem um Código de Indicação para investir?</Text>
            <View style={{ position: 'relative' }}>
              <Input
                setValue={setCode}
                placeholder="Insira o Código *"
                value={code.toUpperCase()}
                maxLength={15}
                border
                autoCapitalize="none"
                height={38}
              />
              <TouchableOpacity style={styles.pasteBlock}>
                <Text style={styles.paste}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => setChecked(!checked)} style={styles.cardItem}>
              <View>
                <Text style={styles.couponName}>Teste100</Text>
                <View style={styles.validBlock}>
                  <Text style={styles.valid}>Válido até 30/09/2024</Text>
                </View>
              </View>
              <View
                style={{
                  ...styles.radio,
                  borderColor: theme.colors.text,
                }}>
                {checked && <View style={styles.fillRadio} />}
              </View>
            </TouchableOpacity>
            <View style={styles.rules}>
              <TouchableOpacity style={styles.rulesHead} onPress={() => setShowRules(!showRules)}>
                <Text style={styles.rulesTitle}>Regras do cupom</Text>
                {/* <Icon
                  name={showRules ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={theme.colors.text}
                /> */}
              </TouchableOpacity>
              {showRules && (
                <View>
                  <Text style={styles.rulesDesc}>
                    {`\u2022`} Ao chegar em 100% do valor financiado, a solicitação é encerrada
                    imediatamente.
                  </Text>
                  <Text style={styles.rulesDesc}>
                    {`\u2022`} A Taxa de Juros acima é igual ao seu Retorno Bruto (antes do desconto
                    de IR, custos de TED e potencial inadimplência). Em caso de atraso do devedor,
                    [1]% de multa e 1% de mora serão divido e repassado ao investidor caso pago. *Os
                    rendimentos serão pagos nas ultimas parcelas do contrato quando o investidor
                    terá recebido de volta o valor investido inicialmente.
                  </Text>
                  <Text style={styles.rulesDesc}>
                    {`\u2022`} A Taxa de Juros acima é igual ao seu Retorno Bruto (antes do desconto
                    de IR, custos de TED e potencial inadimplência). Em caso de atraso do devedor,
                    [1]% de multa e 1% de mora serão divido e repassado ao investidor caso pago. *Os
                    rendimentos serão pagos nas ultimas parcelas do contrato quando o investidor
                    terá recebido de volta o valor investido inicialmente.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
