/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { GetPublicTerms } from '@/services/common';
import { useTheme } from '@/context/MyThemeContext';
import BottomSheet from '../BottomSheet';
import { ScrollView } from 'react-native-gesture-handler';
import Logo from '@/../assets/newSvgs/LogoClaro.svg';
import LogoWhite from '@/../assets/newSvgs/LogoBranco.svg';
import CloseIcon from '@/../assets/newSvgs/icons/close_small.svg';

type authProps = {
  refRBSheet: React.RefObject<RBSheet>;
};

export default function BottomsheetTerms({ refRBSheet }: authProps) {
  const dispatch = useAppDispatch();
  const { publicTerms } = useAppSelector(state => state.common);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      flex: 1,
    },
    btnClose: {
      width: 40,
      height: 40,
      backgroundColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite,
      borderRadius: 40,
      marginLeft: 'auto',
      marginTop: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      marginVertical: 18,
      marginBottom: theme.dark ? 18 : 24,
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 18,
      marginBottom: 16,
      textTransform: 'uppercase',
    },
    desc: {
      color: theme.customColors.baseWhite,
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      flex: 1,
    },
  });

  async function getTerms() {
    await dispatch(GetPublicTerms());
  }

  useEffect(() => {
    if (!publicTerms) {
      getTerms();
    }
  }, []);

  return (
    <BottomSheet refRBSheet={refRBSheet} height={440} draggable={false}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => refRBSheet?.current?.close()} style={styles.btnClose}>
          <CloseIcon color={theme.navigation.colors.text} width={24} height={24} />
        </TouchableOpacity>
        <View style={styles.logo}>
          {theme.dark ? <Logo width={150} /> : <LogoWhite width={150} />}
        </View>
        <Text style={styles.title}>Termos e condições</Text>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <TouchableOpacity activeOpacity={1}>
            <Text style={styles.desc}>{publicTerms?.termText ?? ''}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
