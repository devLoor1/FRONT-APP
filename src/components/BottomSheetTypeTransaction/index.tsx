import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BottomSheet from '../BottomSheet';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@/context/MyThemeContext';
import BtnIcon from '../BtnIcon';
import BtnDefault from '@/components/BtnDefault';
import CloseIcon from '@/../assets/newSvgs/icons/close_small.svg';
import { useCustomStyles } from './style';
import { Analytics } from '@/helpers/analytics';

type props = {
  refRBSheet: React.RefObject<RBSheet>;
  filterTypeActive: any | null;
  changeFilter(type: string): void;
};

export default function BottomSheetTypeTransaction({
  refRBSheet,
  filterTypeActive,
  changeFilter,
}: props) {
  const { theme } = useTheme();
  const styles = useCustomStyles();
  const listEntrada = ['Total', 'Depósito', 'Bônus', 'Recompra'];
  const listSaida = ['Total', 'Investimento', 'Resgate'];
  const [inflowType, setTypeInflowType] = useState<string>();
  const [outflowType, setTypeOutflowType] = useState<string>();

  const setType = (value: string, type: string) => {
    if (type === 'entrada') {
      setTypeInflowType(value);
      return;
    }

    setTypeOutflowType(value);
  };

  useEffect(() => {
    Analytics({ pageName: 'FiltroExtratoTipoTransacao' })
    if (!filterTypeActive) {
      setType('Total', 'entrada');
      setType('Total', 'saida');
      return;
    }

    setType(filterTypeActive.entrada, 'entrada');
    setType(filterTypeActive.saida, 'saida');
  }, []);

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      height={420}
      background={theme.customColors.secondary[600]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filtrar</Text>
          <BtnIcon
            style={styles.btnClose}
            width={32}
            height={32}
            bgColor={theme.customColors.baseWhite}
            onPress={() => refRBSheet.current?.close()}>
            <CloseIcon color={theme.customColors.baseBlack} width={16} height={16} />
          </BtnIcon>
        </View>
        <View style={styles.content}>
          <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
            <View>
              <Text style={styles.filterSubtitle}>Entrada</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterBox}>
                {listEntrada.map((entrada, index) => (
                  <TouchableOpacity
                    onPress={() => setType(entrada, 'entrada')}
                    key={index + entrada}
                    style={[
                      styles.filterItem,
                      inflowType === entrada && styles.filterItemSelected,
                    ]}>
                    <Text
                      style={[
                        styles.filterItemText,
                        inflowType === entrada && styles.filterItemTextSelected,
                      ]}
                      numberOfLines={1}>
                      {entrada}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View>
              <Text style={styles.filterSubtitle}>Saída</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterBox}>
                {listSaida.map((saida, index) => (
                  <TouchableOpacity
                    onPress={() => setType(saida, 'saida')}
                    key={index + saida}
                    style={[styles.filterItem, outflowType === saida && styles.filterItemSelected]}>
                    <Text
                      style={[
                        styles.filterItemText,
                        outflowType === saida && styles.filterItemTextSelected,
                      ]}
                      numberOfLines={1}>
                      {saida}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <BtnDefault
              white
              label="Limpar filtros"
              style={styles.button}
              onPress={() => {
                setType('Total', 'entrada');
                setType('Total', 'saida');
                changeFilter('');
                refRBSheet.current?.close();
              }}
            />
            <BtnDefault
              label="Aplicar"
              style={styles.button}
              onPress={() => {
                if (!inflowType || !outflowType) {
                  return;
                }

                const transactionFilterValues: any = {
                  Total: [],
                  Depósito: ['DepositPix', 'InstallmentPaid', '14', 'DepositTed', 'CancelLoan'],
                  Bônus: ['CampaignCashback', 'BonusRecommendation'],
                  Recompra: ['Repurchase'],
                  Investimento: ['ApplyInvestment'],
                  Resgate: ['WithdrawTed', 'Manual', 'WithdrawTedTaxes', 'WithdrawPix', '15'],
                };

                const endpointEntrada = transactionFilterValues[inflowType].reduce(
                  (acc: string, curr: string) => `${acc}` + `&typeTransaction=${curr}`,
                  ''
                );
                const endpointSaida = transactionFilterValues[outflowType].reduce(
                  (acc: string, curr: string) => `${acc}` + `&typeTransaction=${curr}`,
                  ''
                );
                const endpointFilter = endpointEntrada + endpointSaida;
                changeFilter(endpointFilter);
                refRBSheet.current?.close();
              }}
            />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}
