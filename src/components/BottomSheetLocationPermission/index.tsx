import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import BottomSheet from '../BottomSheet';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@/context/MyThemeContext';
import { useCustomStyles } from './style';
import { Analytics } from '@/helpers/analytics';
import BtnDefault from '../BtnDefault';
import LocationIcon from '@/../assets/newSvgs/icons/distance.svg';
import CheckBoxIcon from '@/../assets/newSvgs/icons/check_box.svg';
import * as Linking from 'expo-linking';

type props = {
    refRBSheet: React.RefObject<RBSheet>;
};

export default function BottomSheetLocationPermission({ refRBSheet }: props) {
    const { theme } = useTheme();
    const styles = useCustomStyles();

    const goToSettings = () => {
        Linking.openSettings();
    }

    useEffect(() => {
        if (refRBSheet) {
            Analytics({ pageName: 'AtivarLocalizacao' })
        }
    }, [refRBSheet])

    return (
        <BottomSheet
            refRBSheet={refRBSheet}
            height={370}
            background={theme.customColors.secondary.default}
        >
            <View style={styles.container}>
                <View style={styles.borderTop} />

                <View style={styles.content}>
                    <Text style={styles.title}>Ativar localização</Text>
                    <Text style={styles.text}>
                        Por questões de segurança é necessário ativar sua localização exata para realizar saque da sua conta <Text style={styles.bold}>Wealth Money</Text>.
                    </Text>
                    <View style={styles.iconsBox}>
                        <LocationIcon color={theme.customColors.baseWhite} width={24} height={24} style={styles.bold} strokeWidth={2} />
                        <Text style={[styles.textIcons, styles.bold]}>Selecionar Localização</Text>
                    </View>
                    <View style={styles.iconsBox}>
                        <CheckBoxIcon color={theme.customColors.baseWhite} width={24} height={24} style={styles.bold} strokeWidth={2} />
                        <Text style={[styles.textIcons, styles.bold]}>Toque em Sempre ou Durante o Uso do App</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <BtnDefault
                        white
                        label="Ir para configurações"
                        style={styles.button}
                        onPress={goToSettings}
                    />
                </View>
            </View>
        </BottomSheet>
    );
}