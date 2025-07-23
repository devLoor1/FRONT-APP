import React, { useState } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Text, TouchableOpacity, View } from 'react-native';
import { InvestimentsRequest } from '~/models/investiment/investiments.request';
import CloseIcon from '~/../assets/newSvgs/icons/close_small.svg';
import ArrowUpIcon from '~/../assets/newSvgs/icons/arrow_upward_alt.svg';
import ArrowDownIcon from '~/../assets/newSvgs/icons/arrow_downward_alt.svg';
import BottomSheet from '~/components/BottomSheet';
import { useTheme } from '~/context/MyThemeContext';
import BtnIcon from '~/components/BtnIcon';
import BtnDefault from '~/components/BtnDefault';
import { useCustomStyles } from './style';
import { Analytics } from '~/helpers/analytics';

type filterProps = {
  refRBSheet: React.RefObject<RBSheet>;
  setInvestmentOrder: React.Dispatch<React.SetStateAction<InvestimentsRequest['investmentOrder']>>;
  applyFilterAndOrder(): void;
};

export default function OrderBottomSheet({
  refRBSheet,
  setInvestmentOrder,
  applyFilterAndOrder,
}: filterProps) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const [active, setActive] = useState({
    all: true,
    date: false,
    tot: false,
    value: false,
  });
  const [order, setOrder] = useState<'cresc' | 'desc'>('desc');
  const [orderType, setOrderType] = useState<'all' | 'date' | 'tot' | 'value'>('all');

  function handleOrder(type: 'all' | 'date' | 'tot' | 'value') {
    setOrderType(type);

    switch (type) {
      case 'all':
        setInvestmentOrder(undefined);
        setActive({ all: true, date: false, tot: false, value: false });
        break;
      case 'date':
        setInvestmentOrder(order === 'cresc' ? 'data_compra' : 'data_compra_desc');
        setActive({ all: false, date: true, tot: false, value: false });
        break;
      case 'tot':
        setInvestmentOrder(order === 'cresc' ? 'total_pago' : 'total_pago_desc');
        setActive({ all: false, date: false, tot: true, value: false });
        break;
      case 'value':
        setInvestmentOrder(order === 'cresc' ? 'valor_investido' : 'valor_investido_desc');
        setActive({ all: false, date: false, tot: false, value: true });
        break;
      default:
        setInvestmentOrder(undefined);
        setActive({ all: true, date: false, tot: false, value: false });
        break;
    }
  }

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      draggable={false}
      height={430}
      onOpen={() => Analytics({ pageName: 'OrdenarPesquisa' })}
      background={theme.dark ? theme.customColors.neutrals[800] : theme.customColors.neutrals[100]}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.header}>
          <Text style={styles.title}>Ordenar</Text>
          <BtnIcon
            style={styles.btnClose}
            width={28}
            height={28}
            bgColor={theme.customColors.baseWhite}
            onPress={() => refRBSheet.current?.close()}>
            <CloseIcon color={theme.customColors.baseBlack} width={16} height={16} />
          </BtnIcon>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ordenar por</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[styles.filterOption, active.date && styles.filterOptionSelected]}
              onPress={() => handleOrder('date')}>
              <Text
                style={[styles.filterOptionText, active.date && styles.filterOptionTextSelected]}>
                Data
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, active.tot && styles.filterOptionSelected]}
              onPress={() => handleOrder('tot')}>
              <Text
                style={[styles.filterOptionText, active.tot && styles.filterOptionTextSelected]}>
                Total
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, active.value && styles.filterOptionSelected]}
              onPress={() => handleOrder('value')}>
              <Text
                style={[styles.filterOptionText, active.value && styles.filterOptionTextSelected]}>
                Valor investido
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de ordenação</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[styles.filterOption, order === 'desc' && styles.filterOptionSelected]}
              onPress={() => setOrder('desc')}>
              <Text
                style={[
                  styles.filterOptionText,
                  order === 'desc' && styles.filterOptionTextSelected,
                ]}>
                Ordem decrescente
              </Text>
              <ArrowDownIcon
                style={styles.filterOptionIcon}
                color={
                  order === 'desc' ? theme.customColors.baseWhite : theme.customColors.baseBlack
                }
                height={24}
                width={24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, order === 'cresc' && styles.filterOptionSelected]}
              onPress={() => setOrder('cresc')}>
              <Text
                style={[
                  styles.filterOptionText,
                  order === 'cresc' && styles.filterOptionTextSelected,
                ]}>
                Ordem crescente
              </Text>
              <ArrowUpIcon
                style={styles.filterOptionIcon}
                color={
                  order === 'cresc' ? theme.customColors.baseWhite : theme.customColors.baseBlack
                }
                height={24}
                width={24}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <BtnDefault
            white
            label="Limpar ordenação"
            style={styles.button}
            onPress={() => {
              handleOrder('all');
              setOrder('desc');
              applyFilterAndOrder();
              refRBSheet.current?.close();
            }}
          />
          <BtnDefault
            label="Aplicar"
            style={styles.button}
            onPress={() => {
              Analytics({ eventName: 'OrdenarPesquisa_Continuar' });
              handleOrder(orderType);
              applyFilterAndOrder();
              refRBSheet.current?.close();
            }}
          />
        </View>
      </View>
    </BottomSheet>
  );
}
