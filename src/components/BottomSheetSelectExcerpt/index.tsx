import React, { useEffect, useState } from 'react';
import { Text, View, SectionList, TouchableOpacity } from 'react-native';
import BottomSheet from '../BottomSheet';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@/context/MyThemeContext';
import BtnIcon from '../BtnIcon';
import BtnDefault from '@/components/BtnDefault';
import CloseIcon from '@/../assets/newSvgs/icons/close_small.svg';
import { RadioButton } from 'react-native-paper';
import { useCustomStyles } from './style';
import { PostExcerpstEmail } from '@/services-old/excerpt';
import { useAppDispatch } from '@/redux/hooks';
import { Analytics } from '@/helpers/analytics';

type Props = {
    refRBSheet: React.RefObject<RBSheet>;
};

type Section = {
    title: string;
    data: string[];
};

export default function BottomSheetSelectExcerpt({ refRBSheet }: Props) {
    const { theme } = useTheme();
    const styles = useCustomStyles();
    const dispatch = useAppDispatch();
    const [dates, setDates] = useState<Section[]>([]);
    const [selectedItem, setSelectedItem] = useState<{ month: string; year: string } | null>(null);
    const [page, setPage] = useState(1);

    const isSelected = (month: string, year: string) =>
        selectedItem?.month === month && selectedItem?.year === year;

    const handleSelect = (month: string, year: string) => {
        if (isSelected(month, year)) {
            setSelectedItem(null); // desmarca se já está selecionado
        } else {
            setSelectedItem({ month, year });
        }
    };

    const nextPage = async () => {
        if (selectedItem) {
            await dispatch(PostExcerpstEmail(selectedItem));
        }
        setPage(2);
        refRBSheet.current?.close();
        setTimeout(() => {
            refRBSheet.current?.open();
        }, 300);
    };

    const closeBottomSheet = () => {
        setSelectedItem(null);
        refRBSheet.current?.close();
        setPage(1);
    };

    const generateSectionsMonths = (): void => {
        const mesesPorExtenso: string[] = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        const sections: Section[] = [];
        const startYear = 2019;
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const currentDay = today.getDate();

        for (let ano = startYear; ano <= currentYear; ano++) {
            const meses: string[] = [];
            const limiteMeses = ano === currentYear ? currentMonth + 1 : 12;

            for (let i = limiteMeses - 1; i >= 0; i--) {
                let nomeMes = mesesPorExtenso[i];
                if (ano === currentYear && i === currentMonth) {
                    nomeMes += ` (01 ao ${currentDay})`;
                }
                meses.push(nomeMes);
            }

            sections.push({ title: ano.toString(), data: meses });
        }

        setDates(sections.reverse());
    };

    const Item = ({ month, year }: { month: string; year: string }) => (
        <TouchableOpacity
            onPress={() => handleSelect(month, year)}
            style={styles.ItemBox}
        >
            <Text style={styles.textItem}>{month}</Text>
            <RadioButton
                value="check"
                status={isSelected(month, year) ? 'checked' : 'unchecked'}
                color={theme.customColors.secondary[600]}
                onPress={() => handleSelect(month, year)}
            />
        </TouchableOpacity>
    );

    useEffect(() => {
        Analytics({ pageName: 'SolicitarExtrato' })
        generateSectionsMonths();
    }, []);

    return (
        <BottomSheet
            refRBSheet={refRBSheet}
            height={page === 1 ? 500 : 280}
            background={theme.customColors.secondary[600]}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Solicitar Extrato</Text>
                    <BtnIcon
                        style={styles.btnClose}
                        width={32}
                        height={32}
                        bgColor={theme.customColors.baseWhite}
                        onPress={closeBottomSheet}
                    >
                        <CloseIcon color={theme.customColors.baseBlack} width={16} height={16} />
                    </BtnIcon>
                </View>

                <View style={styles.content}>
                    {page === 1 && (
                        <View style={{ flex: 1 }}>
                            <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
                                <Text style={styles.filterSubtitle}>Selecione o mês que você quer no seu extrato</Text>
                            </View>
                            <View style={{ flex: 1, marginTop: 10, marginBottom: 15 }}>
                                <SectionList
                                    sections={dates}
                                    keyExtractor={(item, index) => item + index}
                                    renderItem={({ item, section }) => <Item month={item} year={section.title} />}
                                    renderSectionHeader={({ section: { title } }) => (
                                        <View style={styles.titleBox}>
                                            <Text style={styles.titleSection}>{title}</Text>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    )}

                    {page === 2 && (
                        <View style={{ flex: 1 }}>
                            <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
                                <Text style={styles.filterSubtitle}>Seu extrato está chegando</Text>
                            </View>
                            <View style={styles.messageBox}>
                                <Text style={styles.messageExtract}>
                                    Em alguns minutos você receberá um e-mail com os arquivos em PDF anexado.
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        <BtnDefault
                            label={page === 1 ? 'Exportar Extrato' : 'Finalizar'}
                            disabled={page === 1 && !selectedItem}
                            style={styles.button}
                            onPress={() => (page === 1 ? nextPage() : closeBottomSheet())}
                        />
                    </View>
                </View>
            </View>
        </BottomSheet>
    );
}
