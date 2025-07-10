import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useCustomStyles } from '../../style';
import { useTheme } from '~/context/MyThemeContext';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';

import CommonMask from '~/helpers/masks';
import { GetDebtEvolution } from '~/services/opportunitiePJ';
import LoadingComp from '~/components/Loading';
import { Analytics } from '~/helpers/analytics';
import ChartArea from '../ChartArea';

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export default function Evolution() {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { opportunitieDetail, debtEvolution, loadingDebtEvolution } = useAppSelector(
    state => state.opportunitiePJ
  );
  const [date, setDate] = useState('');
  const [selectedDebt, setSelectedDebt] = useState(0);

  const pStyles = StyleSheet.create({
    value: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      color: theme.dark ? theme.customColors.error.default : theme.customColors.error[300],
    },
    label: {
      fontSize: 12,
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
    },
    desc: {
      color: theme.colors.text,
      fontSize: 10,
      fontFamily: theme.fonts.regular,
    },
    itemTitle: {
      color: theme.customColors.neutrals[400],
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
    percent: {
      color: theme.colors.text,
      fontSize: 14,
      fontFamily: theme.fonts.bold,
    },
  });

  async function getDebtEvolution() {
    if (opportunitieDetail) {
      await dispatch(GetDebtEvolution({ idUser: opportunitieDetail.idUser }));
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'OportunidadeDetalhesEvolucaoDivida' });
    if (opportunitieDetail) {
      getDebtEvolution();
    }
  }, []);

  function formatDate(value = '', range?: string) {
    if (range) {
      setDate(range);
      return;
    }

    const lastDate: string[] = value.split('/');
    setDate(months[+lastDate[0] - 1] + '/' + lastDate[1]);
  }

  useEffect(() => {
    if (debtEvolution) {
      formatDate(undefined, 'Todo o período');
      setSelectedDebt(debtEvolution.debts.reduce((acc, curr) => acc + curr.value, 0));
    }
  }, [debtEvolution]);

  if (loadingDebtEvolution) {
    return <LoadingComp />;
  }

  if (debtEvolution) {
    return (
      <View style={styles.tabContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Evolução da dívida</Text>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={pStyles.itemTitle}>Dívidas de longo prazo</Text>
              <Text style={pStyles.label}>
                R$ {CommonMask.currency(debtEvolution.longTermValue.toFixed(2).toString())}
              </Text>
            </View>
            <Text style={pStyles.percent}>
              {CommonMask.percent(debtEvolution.longTermPercent.toFixed(2))}%
            </Text>
          </View>
          <View style={styles.cardBorder} />
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={pStyles.itemTitle}>Dívidas de curto prazo</Text>
              <Text style={pStyles.label}>
                R$ {CommonMask.currency(debtEvolution.shortTermValue.toFixed(2).toString())}
              </Text>
            </View>
            <Text style={pStyles.percent}>
              {CommonMask.percent(debtEvolution.shortTermPercent.toFixed(2))}%
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={{ ...styles.cardRow, marginBottom: 8 }}>
            <Text style={{ ...styles.title, marginBottom: 0 }}>Dívida em:</Text>
            <Text style={pStyles.desc}>{date}</Text>
          </View>
          <Text style={[pStyles.value, { color: theme.customColors.error.default }]}>
            R$ {CommonMask.currency(selectedDebt.toFixed(2).toString())}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Evolução da dívida</Text>
          <ChartArea
            setSelectedDebt={setSelectedDebt}
            selectedDebt={selectedDebt}
            formatDate={formatDate}
            date={date}
            chartColor={
              theme.dark ? theme.customColors.error.default : theme.customColors.error[300]
            }
            activeColor={theme.customColors.error[100]}
            arrData={debtEvolution.debts}
            tooltipText="Dívida"
          />
        </View>
        {debtEvolution?.debtsDetails?.length ? (
          <View style={styles.card}>
            <FlatList
              scrollEnabled={false}
              data={debtEvolution.debtsDetails}
              renderItem={({ item, index }) => (
                <View>
                  <View style={styles.cardRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={pStyles.label}>{item.type}</Text>
                    </View>
                    <View style={{ flex: 1.5 }}>
                      <Text style={pStyles.desc}>{item.description}</Text>
                    </View>
                  </View>
                  {index !== debtEvolution.debtsDetails.length - 1 && (
                    <View style={styles.cardBorder} />
                  )}
                </View>
              )}
            />
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  }

  return <></>;
}
