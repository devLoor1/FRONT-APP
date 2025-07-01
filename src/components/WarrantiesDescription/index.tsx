import React, { useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';
import { useCustomStyles } from './styles';
import GuaranteesBottomSheet from '../GuaranteesBottomSheet';
import RBSheet from 'react-native-raw-bottom-sheet';

type WarrantiesDescriptionProps = {
  hasWarranty: boolean;
  hasRepurchase: boolean;
  hasPropertyGuarantee: boolean;
  warrantyTxt?: string | null;
  houseTxt?: string | null;
  fontSize?: number
};

const WarrantiesDescription: React.FC<WarrantiesDescriptionProps> = ({
  hasWarranty,
  hasRepurchase,
  hasPropertyGuarantee,
  warrantyTxt,
  houseTxt,
  fontSize = 10,
}) => {
  const refRBSheetGuarantees = useRef<RBSheet>(null);
  const { theme } = useTheme();
  const styles = useCustomStyles();

  if (!hasWarranty && !hasRepurchase && !hasPropertyGuarantee) return null;
  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -16 }}
        contentContainerStyle={styles.tags}>
        <TouchableOpacity style={styles.icons} onPress={() => refRBSheetGuarantees.current?.open()}>
          {hasRepurchase && (
            <View style={[styles.type, { backgroundColor: theme.customColors.secondary[400] }]}>
              <Text style={[styles.typeText, { fontSize: fontSize }]}>Recompra garantida</Text>
            </View>
          )}
          {hasPropertyGuarantee && (
            <View style={[styles.type, { backgroundColor: theme.customColors.secondary.default }]}>
              <Text style={[styles.typeText, { fontSize: fontSize }]}>Garantia do imóvel</Text>
            </View>
          )}
          {hasWarranty && (
            <View style={[styles.type, styles.typeDark]}>
              <Text style={[styles.typeText, styles.typeTextDark, { fontSize: fontSize }]}>Aval dos sócios</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
      <GuaranteesBottomSheet
        refRBSheet={refRBSheetGuarantees}
        hasRepurchase={hasRepurchase}
        hasWarranty={hasWarranty}
        hasPropertyGuarantee={hasPropertyGuarantee}
        warrantyTxt={warrantyTxt || ''}
        houseTxt={houseTxt || ''}
      />
    </>
  );
};

export default WarrantiesDescription;
