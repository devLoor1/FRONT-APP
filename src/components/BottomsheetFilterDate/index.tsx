import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import BottomSheet from '../BottomSheet';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@/context/MyThemeContext';
import BtnIcon from '../BtnIcon';
import BtnDefault from '@/components/BtnDefault';
import DatePickerSpinner from '../DatePickerSpinner';
import CloseIcon from '@/../assets/newSvgs/icons/close_small.svg';
import { useCustomStyles } from './style';
import { Analytics } from '@/helpers/analytics';


type props = {
    refRBSheet: React.RefObject<RBSheet>;
    changeFilter(day: number): void;
};

export default function BottomsheetFilterDate({ refRBSheet, changeFilter }: props) {
    const { theme } = useTheme();
    const styles = useCustomStyles();
    const [dateFilter, setDataFilter] = useState<Date | undefined>()

    const setData = (date: Date) => {
        setDataFilter(date)
    }

    useEffect(() => {
        Analytics({ pageName: 'FiltroExtratoData' })
    }, [])

    return (
        <BottomSheet
            refRBSheet={refRBSheet}
            height={420}
            background={theme.customColors.secondary[600]}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Filtro por data</Text>
                    <BtnIcon
                        style={styles.btnClose}
                        width={32}
                        height={32}
                        bgColor={theme.customColors.baseWhite}
                        onPress={() => refRBSheet.current?.close()}>
                        <CloseIcon color={theme.customColors.baseBlack} width={16} height={16} />
                    </BtnIcon>
                </View>
                <View style={styles.content}>
                    <Text style={styles.filterSubtitle}>{'Selecione a partir da data de ínicio'}</Text>
                    <View style={{ flex: 1, marginTop: 20, }}>
                        <DatePickerSpinner setDate={(value) => { setData(value) }} dateFilterActive={dateFilter} />
                    </View>

                    <View style={styles.buttonContainer}>
                        <BtnDefault
                            white
                            label="Fechar"
                            style={styles.button}
                            onPress={() => {
                                refRBSheet.current?.close()
                            }}
                        />
                        <BtnDefault
                            label="Filtrar"
                            style={styles.button}
                            onPress={() => {
                                if (!dateFilter) { return }

                                const msPorDia = 1000 * 60 * 60 * 24;
                                const today = new Date()
                                const diffData = (today.getTime() - dateFilter.getTime()) / msPorDia
                                changeFilter(Math.floor(diffData))
                                refRBSheet.current?.close()
                            }}
                        />
                    </View>
                </View>
            </View>
        </BottomSheet>
    );
}