/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import Billing from './components/Billing';
import Credit from './components/Credit';
import Evolution from './components/Evolution';
import { ScrollView, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { GetFinancialData } from '~/services/opportunitiePJ';
import LoadingComp from '~/components/Loading';
import { useCustomStyles } from './style';
import { useTheme } from '~/context/MyThemeContext';
import BackToTop from '~/components/BackToTop';
import CommonMask from '~/helpers/masks';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Rating from './components/Rating';
import { Analytics } from '~/helpers/analytics';

const recepts = [
  {
    title: 'Redução',
    desc: 'Empresa com queda de receita no período analisada.',
  },
  {
    title: 'Instável',
    desc: 'Receitas com forte volatilidade.',
  },
  {
    title: 'Estagnada',
    desc: 'Estagnada Com crescimento abaixo da inflação.',
  },
  {
    title: 'Estável',
    desc: 'Crescimento de 5% até 10% acima da inflação.',
  },
  {
    title: 'Consolidada',
    desc: 'Crescimento até 10% acima da inflação (5 anos de mercado).',
  },
  {
    title: 'Ascensão',
    desc: 'Crescimento da receita maior que 10% acima da inflação.',
  },
];

const tabs = [
  {
    title: 'Rating',
    seo: 'DadosFinanRating',
    comp: Rating,
  },
  {
    title: 'Faturamento',
    seo: 'DadosFinanFaturamento',
    comp: Billing,
  },
  {
    title: 'Linhas de crédito',
    seo: 'DadosFinanLCredito',
    comp: Credit,
  },
  {
    title: 'Evolução da dívida',
    seo: 'DadosFinanEDivida',
    comp: Evolution,
  },
];

export default function FinancialData() {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(tabs[0].title);
  const [showToUp, setShowToUp] = useState(false);
  const refPage = useRef<ScrollView>(null);
  const { opportunitieDetail, loadingFinancial, financialData } = useAppSelector(
    state => state.opportunitiePJ
  );

  async function getFinancialData() {
    if (opportunitieDetail) {
      await dispatch(GetFinancialData({ idUser: opportunitieDetail.idUser }));
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'DadosFinanRating' });
  }, []);

  useEffect(() => {
    if (opportunitieDetail) {
      getFinancialData();
    }
  }, [opportunitieDetail]);

  function getTopScroll(e: any) {
    const offset = e.nativeEvent.contentOffset.y;
    if (offset > 350) {
      setShowToUp(true);
    } else {
      setShowToUp(false);
    }
  }

  if (loadingFinancial) {
    return <LoadingComp />;
  }

  return (
    <View style={{ flex: 1 }}>
      {financialData && (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEventThrottle={16}
          onScroll={e => getTopScroll(e)}
          ref={refPage}>
          <View>
            <View style={styles.content}>
              <Text style={styles.title}>Análise Econômico-Financeira</Text>
              <Text style={styles.subtitle}>Highlights Financeiros</Text>
              <View style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>Crescimento dos últimos 12 meses</Text>
                    <Text style={{ ...styles.cardDesc, maxWidth: 190 }}>
                      Crescimento dos últimos 12 meses sobre o período de 12 meses anterior
                    </Text>
                  </View>
                  <Text style={styles.cardValue}>
                    {CommonMask.percent(financialData.companyGrowth.toString())}%
                  </Text>
                </View>
                <View style={styles.cardBorder} />
                <View style={styles.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>Volatilidade das Receitas Mensais</Text>
                    <Text style={{ ...styles.cardDesc, maxWidth: 190 }}>
                      Volatilidade média do último ano. Quanto maior, mais volátil é. Até 30% é
                      considerado baixa
                    </Text>
                  </View>
                  <Text style={styles.cardValue}>
                    {CommonMask.percent(financialData.monthlyRevenueVolatility.toString())}%
                  </Text>
                </View>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Perfil das Receitas</Text>
                {recepts.map((item, index) => (
                  <Text key={item.title} style={styles.cardItem}>
                    <Text style={{ fontFamily: theme.fonts.bold }}>
                      {index}. {item.title}
                    </Text>{' '}
                    - {item.desc}
                  </Text>
                ))}
              </View>
            </View>
            <View style={styles.about}>
              <Text style={styles.aboutTxt}>
                A empresa solicitante declarou que os documentos e informações disponibilizadas são
                verdadeiros e precisos em todos os aspectos, e que, portanto, a Wise Money não se
                compromete com a veracidade de tais documentos e informações. Não obstante esta
                limitação, a Wise Money realiza os melhores esforços de forma diligente e
                responsável com o objetivo de mostrar informações verídicas e precisas, como por
                exemplo, análise dos documentos e informações prestadas, checagem e cruzamento de
                dados de diversas fontes, e questionamentos adicionais pertinentes à empresa
                solicitante sempre que entender necessário.
              </Text>
            </View>
          </View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.tabsHeader}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.title}
                onPress={() => {
                  Analytics({ eventName: `DadosFinanRating_${tab.seo}` });
                  setActiveTab(tab.title);
                }}
                style={{
                  ...styles.tabTitleBlock,
                  marginLeft: index === 0 ? 16 : 0,
                  marginRight: index === tabs.length - 1 ? 16 : 8,
                  backgroundColor:
                    activeTab === tab.title
                      ? theme.customColors.secondary.default
                      : theme.dark
                      ? theme.customColors.neutrals[700]
                      : theme.customColors.neutrals[100],
                }}>
                <Text
                  style={{
                    ...styles.tabTitleTxt,
                    color:
                      activeTab === tab.title ? theme.customColors.baseWhite : theme.colors.text,
                  }}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={{ minHeight: 300 }}>
            {tabs.map(tab => (
              <View key={tab.title} style={{ flex: 1 }}>
                {activeTab === tab.title ? <tab.comp /> : <></>}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
      {showToUp && <BackToTop scrollRef={refPage} mb={128} />}
    </View>
  );
}
