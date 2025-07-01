import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import BottomSheet from '../BottomSheet';
import BtnIcon from '../BtnIcon';
import { useTheme } from '@/context/MyThemeContext';
import CloseIcon from '@/../assets/newSvgs/icons/close_small.svg';
import { Analytics } from '@/helpers/analytics';

type Props = {
  refRBSheet: any;
  hasWarranty: boolean;
  hasRepurchase: boolean;
  hasPropertyGuarantee: boolean;
  houseTxt: string;
  warrantyTxt: string;
};

export default function GuaranteesBottomSheet({
  refRBSheet,
  hasWarranty,
  hasRepurchase,
  hasPropertyGuarantee,
  warrantyTxt,
  houseTxt,
}: Props) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      gap: 24,
    },
    header: {
      marginHorizontal: -16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.customColors.secondary[600],
    },
    title: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 18,
    },
    btnClose: {
      backgroundColor: theme.customColors.baseWhite,
      justifyContent: 'center',
      alignItems: 'center',
    },
    section: {
      marginBottom: 16,
      gap: 4,
    },
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    sectionText: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 14,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      alignSelf: 'flex-start',
    },
    sectionContent: {
      color: theme.dark ? theme.customColors.neutrals[300] : theme.customColors.neutrals[400],
      fontFamily: theme.fonts.regular,
      fontSize: 12,
      lineHeight: 18,
    },
  });

  const renderSection = (
    title: string,
    content: string,
    backgroundColor: string,
    color?: string
  ) => (
    <View style={styles.section}>
      <Text style={[styles.sectionText, { backgroundColor }, color ? { color } : {}]}>{title}</Text>
      <Text style={[styles.sectionContent]}>{content}</Text>
    </View>
  );

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      draggable={false}
      onOpen={() => Analytics({ pageName: 'InfoGarantias' })}
      background={theme.dark ? theme.customColors.neutrals[800] : '#fff'}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Garantias</Text>
          <BtnIcon
            style={styles.btnClose}
            width={28}
            height={28}
            bgColor={theme.customColors.baseWhite}
            onPress={() => refRBSheet.current.close()}>
            <CloseIcon color={theme.customColors.baseBlack} width={18} height={18} />
          </BtnIcon>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {hasWarranty &&
            renderSection(
              'Aval dos sócios',
              warrantyTxt,
              theme.dark ? theme.customColors.baseWhite : theme.customColors.neutrals[900],
              theme.dark ? theme.customColors.baseBlack : theme.customColors.baseWhite
            )}
          {hasRepurchase &&
            renderSection(
              'Recompra garantida',
              'Investindo nessa cota, em caso de inadimplência superior a 90 dias, a Wmoney negociará sua CCB com nosso parceiro para recuperar o seu valor investido descontando o valor recebido.',
              theme.customColors.secondary[400]
            )}
          {hasPropertyGuarantee &&
            renderSection('Garantia de imóvel', 
            "Na modalidade de operação de crédito com garantia de Imóvel, a operação estará garantida em 150% do saldo devedor. Em caso de inadimplência superior a 90 dias, a Wealth Money, faz a notificação via cartório e executa o imóvel, após consolidação levamos o imóvel a leilão e repassamos o recurso aos investidores.", 
            theme.customColors.secondary.default)}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
