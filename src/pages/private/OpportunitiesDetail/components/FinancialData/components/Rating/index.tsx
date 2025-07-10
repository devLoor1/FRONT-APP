import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useCustomStyles } from '../../style';
import { useTheme } from '~/context/MyThemeContext';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import CommonMask from '~/helpers/masks';
import { GetRating } from '~/services/opportunitiePJ';
import LoadingComp from '~/components/Loading';
import ModalDefault from '~/components/ModalDefault';
import InfoIcon from '~/../assets/newSvgs/icons/info-fill.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RadarChart from './components/RadarChart';
import { Analytics } from '~/helpers/analytics';

export default function Rating() {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const { opportunitieDetail, ratingList, loadingRating } = useAppSelector(
    state => state.opportunitiePJ
  );

  const pStyles = StyleSheet.create({
    label: {
      fontSize: 12,
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
    },
    value: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      color: theme.customColors.hyperlink,
    },
    desc: {
      color: theme.colors.text,
      fontSize: 10,
      fontFamily: theme.fonts.regular,
    },
  });

  async function getRating() {
    if (opportunitieDetail) {
      await dispatch(GetRating({ idUser: opportunitieDetail.idUser }));
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'OportunidadeDetalhesRating' });
    if (opportunitieDetail) {
      getRating();
    }
  }, []);

  function showModal(title: string, desc: string) {
    setModalTitle(title);
    setModalDesc(desc);
    setVisible(true);
  }

  if (loadingRating) {
    return <LoadingComp />;
  }

  return (
    <View style={styles.tabContent}>
      {ratingList && (
        <View style={styles.card}>
          <Text style={styles.title}>Perfil das Receitas</Text>
          <FlatList
            scrollEnabled={false}
            data={ratingList.pillars}
            renderItem={({ item }) => (
              <View>
                <View style={styles.cardRow}>
                  <View style={styles.cardRow}>
                    <Text style={pStyles.label}>{item.pillarRating}</Text>
                    <TouchableOpacity
                      onPress={() => showModal(item.pillarRating, item.description)}>
                      <InfoIcon width={16} height={16} color={theme.customColors.hyperlink} />
                    </TouchableOpacity>
                  </View>
                  <Text style={pStyles.value}>{CommonMask.percent(item.value.toString())}</Text>
                </View>
                <View style={styles.cardBorder} />
              </View>
            )}
          />
          <Text style={{ ...pStyles.value, fontFamily: theme.fonts.regular }}>
            As notas de cada pilar variam no Intervalo de {ratingList.intervalMin} a{' '}
            {ratingList.intervalMax}.
          </Text>
        </View>
      )}
      <View style={styles.card}>
        <RadarChart />
      </View>
      {ratingList && (
        <View style={styles.card}>
          <FlatList
            scrollEnabled={false}
            data={ratingList.pillars}
            renderItem={({ item, index }) => (
              <View>
                <View style={styles.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={pStyles.label}>{item.pillarRating}</Text>
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <Text style={pStyles.desc}>{item.description}</Text>
                  </View>
                </View>
                {index !== ratingList.pillars.length - 1 && <View style={styles.cardBorder} />}
              </View>
            )}
          />
        </View>
      )}

      <ModalDefault visible={visible} setVisible={setVisible} title={modalTitle} desc={modalDesc} />
    </View>
  );
}
