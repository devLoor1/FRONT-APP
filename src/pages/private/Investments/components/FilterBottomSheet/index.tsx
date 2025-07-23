import React, { useState } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Text, TouchableOpacity, View } from 'react-native';
import { InvestimentsRequest } from '~/models/investiment/investiments.request';
import CloseIcon from '~/../assets/newSvgs/icons/close_small.svg';
import BottomSheet from '~/components/BottomSheet';
import { useTheme } from '~/context/MyThemeContext';
import BtnIcon from '~/components/BtnIcon';
import { useCustomStyles } from './style';
import BtnDefault from '~/components/BtnDefault';
import { Analytics } from '~/helpers/analytics';

type filterProps = {
  refRBSheet: React.RefObject<RBSheet>;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  applyFilterAndOrder(): void;
};

export default function Filter({
  refRBSheet,
  setFilter,
  applyFilterAndOrder,
}: filterProps) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const [active, setActive] = useState({
    all: true,
    risk: false,
    status: false,
    paymentType: false,
    favorite: false
  });

  function handleFilter(type: 'all' | 'status' | 'risk' | 'paymentType' | 'favorite') {
    switch (type) {
      case 'all':
        setFilter('');
        setActive({ all: true, risk: false, status: false, paymentType: false, favorite: false });
        break;
      case 'status':
        setFilter('statusInvestment=status_pago');
        setActive({ all: false, risk: false, status: true, paymentType: false, favorite: false });
        break;
      case 'risk':
        setFilter('creditRisk=risco_super_baixo');
        setActive({ all: false, risk: true, status: false, paymentType: false, favorite: false });
        break;
      case 'paymentType':
        setFilter('Modality=pagamento_unico');
        setActive({ all: false, risk: false, status: false, paymentType: true, favorite: false });
        break;
      case 'favorite':
        setFilter('Favorites=true ');
        setActive({ all: false, risk: false, status: false, paymentType: false, favorite: true });
        break;
      default:
        setFilter('');
        setActive({ all: true, risk: false, status: false, paymentType: false, favorite: false });
        break;
    }
  }

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      draggable={false}
      height={300}
      onOpen={() => Analytics({ pageName: 'FiltroPesquisa' })}
      background={theme.dark ? theme.customColors.neutrals[800] : theme.customColors.neutrals[100]}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Filtrar</Text>
          <BtnIcon
            style={styles.btnClose}
            width={28}
            height={28}
            bgColor={theme.customColors.baseWhite}
            onPress={() => refRBSheet.current?.close()}>
            <CloseIcon color={theme.customColors.baseBlack} width={16} height={16} />
          </BtnIcon>
        </View>
        <View style={{ ...styles.section, flex: 1 }}>
          <Text style={styles.sectionTitle}>Filtrar por</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[styles.filterOption, active.all && styles.filterOptionSelected]}
              onPress={() => handleFilter('all')}>
              <Text
                style={[styles.filterOptionText, active.all && styles.filterOptionTextSelected]}>
                Tudo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, active.risk && styles.filterOptionSelected]}
              onPress={() => handleFilter('risk')}>
              <Text
                style={[styles.filterOptionText, active.risk && styles.filterOptionTextSelected]}>
                Risco
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, active.paymentType && styles.filterOptionSelected]}
              onPress={() => handleFilter('paymentType')}>
              <Text
                style={[styles.filterOptionText, active.paymentType && styles.filterOptionTextSelected]}>
                Modalidade
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, active.status && styles.filterOptionSelected]}
              onPress={() => handleFilter('status')}>
              <Text
                style={[styles.filterOptionText, active.status && styles.filterOptionTextSelected]}>
                Status
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, active.favorite && styles.filterOptionSelected]}
              onPress={() => handleFilter('favorite')}>
              <Text
                style={[styles.filterOptionText, active.favorite && styles.filterOptionTextSelected]}>
                Favoritos
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <BtnDefault
            white
            label="Limpar filtros"
            style={styles.button}
            onPress={() => {
              handleFilter('all');
              applyFilterAndOrder();
              refRBSheet.current?.close();
            }}
          />
          <BtnDefault
            label="Aplicar"
            style={styles.button}
            onPress={() => {
              Analytics({ eventName: 'FiltroPesquisa_Continuar' });
              applyFilterAndOrder();
              refRBSheet.current?.close();
            }}
          />
        </View>
      </View>
    </BottomSheet>
  );
}
