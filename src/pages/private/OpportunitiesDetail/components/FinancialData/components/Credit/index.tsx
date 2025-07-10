import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import { useCustomStyles } from '../../style';
import { useTheme } from '~/context/MyThemeContext';
import CommonMask from '~/helpers/masks';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { GetCompanyDebt } from '~/services/opportunitiePJ';
import LoadingComp from '~/components/Loading';
import { Analytics } from '~/helpers/analytics';

export default function Credit() {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { opportunitieDetail, companyDebt, loadingCompanyDebt } = useAppSelector(
    state => state.opportunitiePJ
  );

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
    itemTitle: {
      color: theme.customColors.neutrals[400],
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
    percent: {
      fontSize: 14,
      fontFamily: theme.fonts.bold,
    },
    legendMarker: {
      width: 12,
      height: 12,
      borderRadius: 4,
      marginRight: 4,
    },
    legendTitle: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 10,
      color: theme.colors.text,
      marginBottom: 4,
    },
    legendDesc: {
      fontFamily: theme.fonts.regular,
      fontSize: 10,
      color: theme.customColors.neutrals[500],
    },
  });

  async function getCompanyDebt() {
    if (opportunitieDetail) {
      await dispatch(GetCompanyDebt({ idUser: opportunitieDetail.idUser }));
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'OportunidadeDetalhesLinhaCredito' });
    if (opportunitieDetail) {
      getCompanyDebt();
    }
  }, []);

  if (loadingCompanyDebt) {
    return <LoadingComp />;
  }

  return (
    <View style={styles.tabContent}>
      {companyDebt && (
        <View style={styles.card}>
          <Text style={styles.title}>linhas de crédito</Text>

          <FlatList
            scrollEnabled={false}
            data={companyDebt.creditLines}
            renderItem={({ item }) => (
              <View>
                <View style={styles.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...pStyles.itemTitle, maxWidth: 250 }}>{item.description}</Text>
                    <Text style={pStyles.label}>
                      R$ {CommonMask.currency(item.creditLineValue.toFixed(2).toString())}
                    </Text>
                  </View>
                  <Text
                    style={{
                      ...pStyles.percent,
                      color:
                        item.typeDebt === 'longo_prazo'
                          ? '#E99C28'
                          : item.typeDebt === 'curto_prazo'
                            ? theme.customColors.primary.default
                            : theme.customColors.secondary[500],
                    }}>
                    {CommonMask.percent(item.creditLinePercentage.toString())}%
                  </Text>
                </View>
                <View style={styles.cardBorder} />
              </View>
            )}
          />

          <View style={{ flexDirection: 'row', gap: 24 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View
                style={{
                  ...pStyles.legendMarker,
                  backgroundColor: theme.customColors.secondary[500],
                }}
              />
              <View>
                <Text style={pStyles.legendTitle}>Curtíssimo prazo</Text>
                <Text style={pStyles.legendDesc}>Até 90 dias</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View
                style={{
                  ...pStyles.legendMarker,
                  backgroundColor: theme.customColors.primary.default,
                }}
              />
              <View>
                <Text style={pStyles.legendTitle}>Curto prazo</Text>
                <Text style={pStyles.legendDesc}>De 90 até 120 dias</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View
                style={{
                  ...pStyles.legendMarker,
                  backgroundColor: '#E99C28',
                }}
              />
              <View>
                <Text style={pStyles.legendTitle}>Longo prazo</Text>
                <Text style={pStyles.legendDesc}>Acima de 360 dias</Text>
              </View>
            </View>
          </View>
        </View>
      )}
      {(companyDebt?.debtDetails && companyDebt.debtDetails.length > 0)  && (
        <View style={styles.card}>
          <FlatList
            scrollEnabled={false}
            data={companyDebt.debtDetails}
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
                {index !== companyDebt.debtDetails.length - 1 && <View style={styles.cardBorder} />}
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}
