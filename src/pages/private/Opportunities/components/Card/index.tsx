import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useRef, useState } from 'react';
import { useCustomStyles } from './style';
import { useNavigation } from '@react-navigation/native';
import CommonMask from '../../../../../helpers/masks';
import { OpportunitiesResponse } from '~/models/opportunities/opportunities.response';
import { useTheme } from '~/context/MyThemeContext';
import BtnDefault from '~/components/BtnDefault';
import ModalDefault from '~/components/ModalDefault';
import InfoIcon from '~/../assets/newSvgs/icons/info.svg';
import CaretRightIcon from '~/../assets/newSvgs/icons/keyboard_arrow_right.svg';
import InvestSimulation from '~/components/InvestSimulation';
import { RootStackParamList } from '~/models/routes/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Analytics } from '~/helpers/analytics';
import ApartmentIcon from '~/../assets/newSvgs/icons/apartment.svg';
import WarrantiesDescription from '~/components/WarrantiesDescription';

type CardProps = {
  opportunity: OpportunitiesResponse[0];
};

export default function Card({ opportunity }: CardProps) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const refRBSheetSimulation = useRef<any>();
  const [showModal, setShowModal] = useState(false);
  const [modalTxt, setModalTxt] = useState('');

  const getRiskColor = () => {
    switch (opportunity.rating.charAt(0)) {
      case 'A':
        return theme.customColors.success.default;
      case 'B':
        return theme.customColors.secondary[700];
      case 'C':
        return theme.customColors.warning[300];
      case 'D':
        return theme.customColors.error.default;
    }
  };

  return (
    <TouchableOpacity
      style={styles.cardBlock}
      onPress={() => {
        Analytics({ eventName: 'OportEntr_InvestirOportunidade' });
        nav.navigate('OpportunitiesDetail', {
          opportunity: opportunity,
          analytics: 'OportEntr',
        } as never);
      }}
    >
      <View style={styles.card}>
        <View>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={styles.img}>
              {opportunity.urlLogo ? (
                <ImageBackground
                  style={styles.img}
                  source={{ uri: opportunity.urlLogo }}
                  resizeMode="contain"
                />
              ) : (
                <ApartmentIcon
                  width={28}
                  height={28}
                  style={{ color: theme.dark ? '#FFF' : theme.customColors.neutrals[600] }}
                />
              )}
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.name}>{opportunity.name}</Text>
              {opportunity.operationMarket && (
                <Text style={styles.sector}>{opportunity.operationMarket}</Text>
              )}
              <View style={styles.codesRow}>
                <Text style={styles.codeText}>
                  {opportunity.codeOpportunity}
                </Text>
                <Text style={[styles.risk, { color: getRiskColor() }]}>
                  Risco {opportunity.rating}
                </Text>
                {opportunity.hasCashback && (
                  <Text style={[styles.codeTxt, { color: theme.customColors.risk.default }]}>
                    Cashback {CommonMask.percent(opportunity.cashback.toFixed(2).toString())}%
                  </Text>
                )}
                <Text
                  style={[
                    styles.codeTxt,
                    {
                      color: theme.dark
                        ? theme.customColors.secondary[100]
                        : theme.customColors.secondary[1000],
                    },
                  ]}>
                  {opportunity.novaOportunidade
                    ? 'Nova'
                    : `${opportunity.qtdOportunidadesTomador}º Captação`}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <WarrantiesDescription
          hasWarranty={opportunity.hasWarranty}
          hasRepurchase={opportunity.hasRepurchase}
          hasPropertyGuarantee={opportunity.hasPropertyGuarantee}
          warrantyTxt={opportunity.warranty}
          houseTxt={opportunity.propertyGuarantee}
        />
        <View style={styles.listBlock}>
          <View style={styles.itemData}>
            <Text style={styles.dataTitle}>Retorno Bruto</Text>
            <Text style={styles.dataDesc}>
              {CommonMask.percent(opportunity.annualReceiveRate.toFixed(2).toString())}%
            </Text>
          </View>
          <View style={styles.itemData}>
            <Text style={styles.dataTitle}>
              {opportunity.paymentType === 'pagamento_unico' ? 'Prazo' : 'Parcelas'}
            </Text>
            <Text style={styles.dataDesc}>
              {opportunity.prazo} {opportunity.prazo > 1 ? 'meses' : 'mês'}
            </Text>
          </View>
          <View style={styles.itemData}>
            <Text style={styles.dataTitle}>Cotas Disponíveis</Text>
            <Text style={styles.dataDesc}>{opportunity.qtdCotasDisponiveis}</Text>
          </View>
          <View style={styles.itemData}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.dataTitle}>Modalidade</Text>
              <TouchableOpacity
                onPress={() => {
                  switch (opportunity.paymentType) {
                    case 'pagamento_unico':
                      setModalTxt(
                        'Nessa modalidade o investidor recebe um único pagamento, que é composto pelo juros acumulado do perído mais o principal.'
                      );
                      break;
                    case 'juros_mensais':
                      setModalTxt(
                        'Nessa modalidade o investidor recebe mensalmente os juros sobre o valor investido e no final do período ele recebe o principal mais juros.'
                      );
                      break;
                    default:
                      setModalTxt(
                        'Nessa modalidade o investidor recebe parcelas mensais compostas do principal mais juros. É o formato mais comum, utiliza a tabela Price como base'
                      );
                      break;
                  }
                  setShowModal(true);
                }}>
                <InfoIcon color={theme.customColors.hyperlink} width={12} height={12} />
              </TouchableOpacity>
            </View>
            <Text style={styles.dataDesc}>{opportunity.paymentTypeDescription}</Text>
          </View>
        </View>

        <View style={styles.valueBlock}>
          <View>
            <Text style={styles.progressTitle}>
              Progresso de captação -{' '}
              {CommonMask.percent(
                (
                  ((opportunity.qtdTotalCotas - opportunity.qtdCotasDisponiveis) * 100) /
                  opportunity.qtdTotalCotas
                )
                  .toFixed(1)
                  .toString()
              )}
              %
            </Text>
            <View style={styles.progress}>
              <View
                style={{
                  ...styles.progressFill,
                  width: `${((opportunity.qtdTotalCotas - opportunity.qtdCotasDisponiveis) * 100) /
                    opportunity.qtdTotalCotas
                    }%`,
                }}
              />
            </View>
          </View>
          <View style={styles.valueContent}>
            <Text style={styles.valueTitle}>Valor da cota:</Text>
            <Text style={styles.value}>
              R$ {CommonMask.currency(opportunity.valorCota.toFixed(2).toString())}
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <BtnDefault
              label="Simular"
              onPress={() => {
                Analytics({ eventName: 'OportEntr_SimuladorOportunidade' });
                refRBSheetSimulation.current.open();
              }}
            />
          </View>
          <View style={{ flex: 2 }}>
            <BtnDefault
              white
              label="Mais detalhes"
              icon={<CaretRightIcon width={24} heigth={24} color={theme.colors.text} />}
              style={styles.buttonRight}
              labelStyle={styles.buttonRightLabel}
              onPress={() => {
                Analytics({ eventName: 'OportEntr_InvestirOportunidade' });
                nav.navigate('OpportunitiesDetail', {
                  opportunity: opportunity,
                  analytics: 'OportEntr',
                } as never);
              }}
            />
          </View>
        </View>
        <InvestSimulation refRBSheet={refRBSheetSimulation} opportunity={opportunity} />
      </View>
      <ModalDefault
        setVisible={setShowModal}
        visible={showModal}
        title="Modalidade"
        desc={modalTxt}
      />
    </TouchableOpacity>
  );
}
