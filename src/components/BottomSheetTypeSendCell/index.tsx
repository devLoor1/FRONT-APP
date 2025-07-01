import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react';
import BottomSheet from '../BottomSheet';
import { useCustomStyles } from './style';
import { useTheme } from '@/context/MyThemeContext';
import Phone from '@/../assets/newSvgs/icons/call.svg';
import WhatsappIcon from '@/../assets/newSvgs/icons/whatsapp_logo.svg';
import ArrowIcon from '@/../assets/newSvgs/icons/keyboard_arrow_right.svg';
import { Analytics } from '@/helpers/analytics';
import CommonMask from '@/helpers/masks';

type Props = {
    cellPhone: string | undefined;
    refRBSheet: any;
    onClose(isWpp: boolean): void
};



export default function BottomSheetTypeSendCell({
    cellPhone,
    refRBSheet,
    onClose,
}: Props) {
    const styles = useCustomStyles();
    const { theme } = useTheme();

    const onCloseTypeSendCell = (isWpp: boolean) => {
        refRBSheet.current?.close()
        onClose(isWpp)
    }

    useEffect(() => {
        Analytics({ pageName: 'ConfirmNumber' })
    }, [])

    return (
        <BottomSheet
            refRBSheet={refRBSheet}
            height={440}
        >
            <>
                <View>
                    <Text style={styles.title}>Validar novo telefone</Text>
                    <Text style={styles.desc}>
                        Para confirmar essa ação, precisamos da{' '}
                        <Text style={{ fontFamily: theme.fonts.bold }}>sua autenticação</Text>. Como deseja
                        continuar?
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            Analytics({ eventName: 'ConfirmNumber_ValidarSMS' });
                            onCloseTypeSendCell(false)
                        }}
                        style={styles.option}>
                        <Phone color={theme.colors.text} width={18} height={18} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.optionDesc}>Enviar código de confirmação via SMS: {' '}{CommonMask.phone(cellPhone || '')}</Text>
                        </View>
                        <ArrowIcon color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            Analytics({ eventName: 'ConfirmNumber_ValidarWhatsapp' });
                            onCloseTypeSendCell(true)
                        }}
                        style={styles.option}>
                        <WhatsappIcon color={theme.colors.text} width={18} height={18} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.optionDesc}>Enviar código de confirmação via Whatsapp: {' '}{CommonMask.phone(cellPhone || '')}</Text>
                        </View>
                        <ArrowIcon color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </>
        </BottomSheet>
    );
}
