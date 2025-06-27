import React, { useEffect } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { useCustomStyles } from './style';
import BtnDefault from '../../../../../components/BtnDefault';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../../../redux/hooks';
import CommonMask from '../../../../../helpers/masks';
import CommonStorage from '../../../../../storages/common-storage';
import WarrantyIcon from '~/../assets/newSvgs/icons/new_releases.svg';
import RepurchaseIcon from '~/../assets/newSvgs/icons/stars.svg';
import HasPropertyIcon from '~/../assets/newSvgs/icons/home.svg';
import { useTheme } from '~/context/MyThemeContext';
import { Analytics } from '~/helpers/analytics';

export default function Opportunities() {
  const { theme } = useTheme();
  const styles = useCustomStyles();
  const navigation = useNavigation();
  const { listOpportunites } = useAppSelector(state => state.onboarding);

  useEffect(() => {
    Analytics({ pageName: 'EntradaApp4' });
  }, []);

  return (
    <View style={styles.container}>
      {listOpportunites && (
        <FlatList
          data={listOpportunites}
          ListHeaderComponent={() => <Text style={styles.title}>Nossas Oportunidades</Text>}
          renderItem={({ item }) => (
            <View key={item.idOpportunity} style={styles.card}>
              <Text style={styles.cardTitle}>{item.operationMarket}</Text>
              <View style={styles.cardHeader}>
                <View style={[styles.type, { backgroundColor: theme.customColors.secondary[400] }]}>
                  <Text style={[styles.typeText, { color: theme.customColors.baseWhite }]}>
                    Oportunidade
                  </Text>
                </View>
                <View style={styles.riskContainer}>
                  <Text style={styles.itemValue}>Risco {item.rating}</Text>
                </View>
                <View style={styles.icons}>
                  {item.hasWarranty && (
                    <WarrantyIcon
                      color={theme.dark ? theme.customColors.neutrals[300] : theme.colors.text}
                    />
                  )}
                  {item.hasRepurchase && (
                    <RepurchaseIcon
                      color={theme.dark ? theme.customColors.neutrals[300] : theme.colors.text}
                    />
                  )}
                  {item.hasPropertyGuarantee && (
                    <HasPropertyIcon
                      color={theme.dark ? theme.customColors.neutrals[300] : theme.colors.text}
                    />
                  )}
                </View>
              </View>

              <View style={styles.content}>
                <View style={[styles.item, styles.itemBorderRight]}>
                  <Text style={styles.itemTitle}>Rentabilidade</Text>
                  <Text style={styles.itemValue}>
                    {CommonMask.percent(item.annualProfitabilityRate.toString()) + '% a.a.'}
                  </Text>
                </View>
                <View style={[styles.item, styles.itemBorderRight]}>
                  <Text style={styles.itemTitle}>Prazo</Text>
                  <Text style={styles.itemValue}>
                    {Math.round(item.paymentDeadlineInDays / 30) + ' meses'}
                  </Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>Modalidade</Text>
                  <Text style={styles.itemValue}>{item.paymentType}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Comece agora</Text>
        <View style={styles.buttons}>
          <BtnDefault
            label="Efetuar Login"
            style={styles.buttonLeft}
            onPress={() => {
              Analytics({ eventName: 'EntradaApp4_LoginAppWM' });
              CommonStorage.SetHideOnboarding(true);
              navigation.navigate('Login' as never);
            }}
          />
          <BtnDefault
            label="Criar Conta"
            style={styles.buttonRight}
            white
            onPress={() => {
              Analytics({ eventName: 'EntradaApp4_CriarConta' });
              CommonStorage.SetHideOnboarding(true);
              navigation.navigate('PreRegister' as never);
            }}
          />
        </View>
      </View>
    </View>
  );
}
