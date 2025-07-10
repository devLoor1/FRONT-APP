import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useCustomStyles } from '../../style';
import { useTheme } from '~/context/MyThemeContext';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { GetRevenue } from '~/services/opportunitiePJ';
import LoadingComp from '~/components/Loading';
import CommonMask from '~/helpers/masks';
import ChartArea from '../ChartArea';
import { Analytics } from '~/helpers/analytics';

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

export default function Billing() {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { opportunitieDetail, revenue, loadingRevenue } = useAppSelector(
    state => state.opportunitiePJ
  );
  const [date, setDate] = useState('');
  const [selectedDebt, setSelectedDebt] = useState(0);

  const pStyles = StyleSheet.create({
    value: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      color: theme.customColors.hyperlink,
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
  });

  async function getRevenue() {
    if (opportunitieDetail) {
      await dispatch(GetRevenue({ idUser: opportunitieDetail.idUser }));
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'OportunidadeDetalhesFaturamento' });
    if (opportunitieDetail) {
      getRevenue();
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
    if (revenue && revenue.revenues.length > 0) {
      formatDate(undefined, 'Todo o período');
      setSelectedDebt(revenue.revenues.reduce((acc, curr) => acc + curr.value, 0));
    }
  }, [revenue]);

  if (loadingRevenue) {
    return <LoadingComp />;
  }

  return (
    <View style={styles.tabContent}>
      {revenue ? (
        <>
          <View style={styles.card}>
            <View style={{ ...styles.cardRow, marginBottom: 8 }}>
              <Text style={{ ...styles.title, marginBottom: 0 }}>Faturamento</Text>
              <Text style={pStyles.desc}>{date}</Text>
            </View>
            <Text style={pStyles.value}>
              R$ {CommonMask.currency(selectedDebt.toFixed(2).toString())}
            </Text>
          </View>
          {revenue.revenues.length > 0 && (
            <View style={styles.card}>
              <ChartArea
                setSelectedDebt={setSelectedDebt}
                selectedDebt={selectedDebt}
                formatDate={formatDate}
                date={date}
                arrData={revenue.revenues}
                chartColor="#299DFE"
                tooltipText="Faturamento"
              />
            </View>
          )}
          {revenue.revenueDetails.length > 0 && (
            <View style={styles.card}>
              <FlatList
                data={revenue.revenueDetails}
                scrollEnabled={false}
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
                    {index !== revenue.revenueDetails.length - 1 && (
                      <View style={styles.cardBorder} />
                    )}
                  </View>
                )}
              />
            </View>
          )}
        </>
      ) : (
        <></>
      )}
    </View>
  );
}
