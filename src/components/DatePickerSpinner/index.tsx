import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { useCustomStyles } from './style';
import { useTheme } from '@/context/MyThemeContext';


type props = {
    setDate: (date: Date) => void;
    dateFilterActive: any
}

type ItemProps = {
    label: string;
    selected: boolean;
    bold: boolean;
};

export default function DatePickerSpinner({ setDate, dateFilterActive }: props) {
    const getDays = (year?: number, month?: number) => {
        const now = new Date();
        const y = year || now.getFullYear();
        const m = month || now.getMonth() + 1;
        const daysInMonth = new Date(y, m, 0).getDate();


        return Array.from({ length: daysInMonth }, (_, index) => ({
            label: String(index + 1).padStart(2, '0'),
            value: index + 1
        }));
    };

    const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'].map((mes, idx) => ({
        label: mes,
        value: idx + 1
    }));
    const anoAtual = new Date().getFullYear();
    const anos = Array.from({ length: anoAtual - 2019 + 1 }, (_, i) => ({
        label: (2019 + i).toString(),
        value: 2019 + i
    }));

    const { theme } = useTheme();
    const styles = useCustomStyles();

    const [diasMes, setDiasMes] = useState<any[]>([]);
    const [dia, setDia] = useState('');
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [indexDia, setIndexDia] = useState(0);
    const [indexMes, setIndexMes] = useState(0);
    const [indexAno, setIndexAno] = useState(0);

    const [scrolling, setScrolling] = useState({
        dia: false,
        mes: false,
        ano: false,
    });

    useEffect(() => {
        const hoje = new Date();

        let diaAtual = String(hoje.getDate()).padStart(2, '0');
        let mesIndex = hoje.getMonth();
        let anoAtual = String(hoje.getFullYear());
        const newDiasMes = getDays(parseInt(anoAtual), mesIndex)
        setDiasMes(newDiasMes);

        if (dateFilterActive) {
            const data = new Date(dateFilterActive);
            diaAtual = data.getUTCDate().toString().padStart(2, '0')
            mesIndex = data.getUTCMonth()
            anoAtual = data.getUTCFullYear().toString()
        }

        const indexDiaAtual = newDiasMes.findIndex(dia => dia.label === diaAtual);
        const indexAnoAtual = anos.findIndex(ano => ano.label === anoAtual);

        setIndexDia(indexDiaAtual)
        setIndexMes(mesIndex)
        setIndexAno(indexAnoAtual)
    }, [])

    useEffect(() => {
        const newDiasMes = getDays(parseInt(ano), meses.findIndex(item => item.label === mes) + 1)
        setDiasMes(newDiasMes);
    }, [mes])


    useEffect(() => {
        const mesIndex = meses.findIndex(item => item.label === mes)
        const data = new Date(parseInt(ano), mesIndex, parseInt(dia))

        if (!data) { return }

        setDate(data);
    }, [dia, mes, ano])

    const Item: React.FC<ItemProps> = ({ label, selected, bold }) => (
        <View style={[styles.itemContainer, selected && styles.selectedItemContainer]}>
            <Text style={[
                styles.itemText,
                selected && styles.selectedItemText,
                bold && styles.selectedItemTextBold
            ]}>
                {label}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>

            <WheelPickerExpo
                backgroundColor={theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite}
                height={200}
                width={75}
                initialSelectedIndex={indexDia}
                items={diasMes}
                renderItem={(item) =>
                    <Item
                        label={item.label}
                        selected={!scrolling.dia && item.label === dia}
                        bold={!scrolling.dia && item.label === dia}
                    />}
                selectedStyle={{ borderColor: theme.customColors.secondary[600], borderWidth: 2.5 }}
                onChange={({ item }) => {
                    setDia(item.label);
                }}
                flatListProps={{
                    onMomentumScrollBegin: () => {
                        setScrolling((prev) => ({ ...prev, ...{ dia: true } }))
                    },
                    onMomentumScrollEnd: () => {
                        setScrolling((prev) => ({ ...prev, ...{ dia: false } }))
                    },
                }}
            />

            <WheelPickerExpo
                backgroundColor={theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite}
                height={200}
                width={75}
                initialSelectedIndex={indexMes}
                items={meses}
                renderItem={(item) =>
                    <Item
                        label={item.label}
                        selected={!scrolling.mes && item.label === mes}
                        bold={false}
                    />}
                selectedStyle={{ borderColor: theme.customColors.secondary[600], borderWidth: 2.5 }}
                onChange={({ item }) => {
                    setMes(item.label);
                }}
                flatListProps={{
                    onMomentumScrollBegin: () => {
                        setScrolling((prev) => ({ ...prev, ...{ mes: true } }))
                    },
                    onMomentumScrollEnd: () => {
                        setScrolling((prev) => ({ ...prev, ...{ mes: false } }))
                    },
                }}
            />

            <WheelPickerExpo
                backgroundColor={theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite}
                height={200}
                width={75}
                initialSelectedIndex={indexAno}
                items={anos}
                renderItem={(item) =>
                    <Item
                        label={item.label}
                        selected={!scrolling.ano && item.label === ano}
                        bold={false}
                    />}
                selectedStyle={{ borderColor: theme.customColors.secondary[600], borderWidth: 2.5 }}
                onChange={({ item }) => {
                    setAno(item.label);
                }}
                flatListProps={{
                    onMomentumScrollBegin: () => {
                        setScrolling((prev) => ({ ...prev, ...{ ano: true } }))
                    },
                    onMomentumScrollEnd: () => {
                        setScrolling((prev) => ({ ...prev, ...{ ano: false } }))
                    },
                }}
            />
        </View>
    );
}