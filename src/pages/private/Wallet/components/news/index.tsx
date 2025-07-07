import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useRef } from 'react';
import { useCustomStyles } from './style';
import { useTheme } from '~/context/MyThemeContext';
import ArrowIcon from '~/../assets/newSvgs/icons/keyboard_arrow_right.svg';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { GetItemFAQ } from '~/services/faq';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/models/routes/navigation';
import FAQDetailBottomSheet from '~/components/FAQDetailBottomSheet';

export default function News() {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { highlightsList } = useAppSelector(state => state.faq);
  const FAQDetailSheetRef = useRef<RBSheet>(null);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.news}>
      <View style={styles.newsContent}>
        {highlightsList?.map(item => (
          <TouchableOpacity
            style={styles.item}
            key={item.id}
            onPress={async () => {
              FAQDetailSheetRef.current?.open();
              await dispatch(GetItemFAQ(item.id));
            }}>
            <ImageBackground
              style={styles.itemImg}
              source={{ uri: item.thumbnail }}
              resizeMode="cover"
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.subtitle}</Text>
              <TouchableOpacity style={styles.itemMore}>
                <Text style={styles.itemMoreTxt}>Saiba mais</Text>
                <ArrowIcon color={theme.colors.text} width={8} height={8} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={{ marginHorizontal: 'auto' }} onPress={() => nav.navigate('FAQ')}>
        <Text style={styles.moreTxt}>veja mais</Text>
      </TouchableOpacity>
      <FAQDetailBottomSheet refRBSheet={FAQDetailSheetRef} />
    </View>
  );
}
