import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useCommon } from '../../context/CommonContext';
import { useTheme } from '@/context/MyThemeContext';
import ModalDefault from '../ModalDefault';
import InfoIcon from '@/../assets/newSvgs/icons/info.svg';
import EyeIcon from '@/../assets/newSvgs/icons/visibility.svg';
import EyeOffIcon from '@/../assets/newSvgs/icons/visibility_off.svg';
import BlurValues from '../BlurValues';
import { useAppSelector } from '@/redux/hooks';

export default function BalanceSmall() {
  const { toogleBalance, showBalance } = useCommon();
  const { resume } = useAppSelector(state => state.wallet);
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const styles = StyleSheet.create({
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      marginTop: 7,
      paddingVertical: 5,
      paddingHorizontal: 16,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals.default,
      borderRadius: 8,
      height: 90,
      // backgroundColor: theme.dark ? theme.customColors.neutrals[700] : '#FFFFFF',
    },
    rowHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 2,
    },
    totTitle: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular,
      fontSize: 12,
    },
    totValue: {
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: theme.fonts.bold,
    },
    valueRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
  });

  return (
    <View style={styles.head}>
      <View>
        <View style={styles.rowHead}>
          <Text style={styles.totTitle}>Saldo disponível</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <InfoIcon width={12} height={12} color={theme.customColors.hyperlink} />
          </TouchableOpacity>
        </View>
        <BlurValues value={resume?.availableBalance?.toFixed(2).toString() || '0'} />
      </View>
      <View>
        <View
          style={{
            ...styles.rowHead,
            justifyContent: 'space-between',
            marginTop: 2,
          }}>
          <TouchableOpacity onPress={toogleBalance}>
            {showBalance ? (
              <EyeIcon width={24} height={24} color={theme.customColors.neutrals[500]} />
            ) : (
              <EyeOffIcon width={24} height={24} color={theme.customColors.neutrals[500]} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ModalDefault
        setVisible={setShowModal}
        visible={showModal}
        title="Saldo disponível"
        desc="O valor apresentado representa seu saldo para investimentos na plataforma. Escolha a melhor oportunidade que se adeque ao seu perfil e invista."
      />
    </View>
  );
}
