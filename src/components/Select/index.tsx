import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { HelperText, Searchbar, TextInput, Divider, RadioButton } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@/context/MyThemeContext';
import { useCustomStyles } from './style';
import ArrowIcon from '@/../assets/newSvgs/icons/keyboard_arrow_down.svg';
import BottomSheet from '../BottomSheet';

type InputType = {
  placeholder?: string;
  value: string;
  form: any;
  arr: {
    list: {
      id: string;
      value: string;
    }[];
  };
  setValue: any;
  fieldName: string;
  withSearch?: boolean;
  error?: boolean;
  txtError?: string;
  label?: string;
  required?: boolean;
  marginBottom?: number;
};

export default function Select({
  placeholder,
  value,
  setValue,
  form,
  arr,
  fieldName,
  withSearch = false,
  error = false,
  txtError = '',
  label,
  required,
  marginBottom = 8,
}: InputType) {
  const { theme } = useTheme();
  const [searchField, setSearchField] = useState('');
  const [arrFiltered, setArrFiltered] = useState<typeof arr.list>([]);
  const styles = useCustomStyles();
  const btSheetRef = useRef<RBSheet>();
  const { height } = useWindowDimensions();

  const onChangeSearch = (query: string) => setSearchField(query);

  useEffect(() => {
    const data = arr.list.filter((item: { value: string; id: string }) =>
      item.value.toLocaleLowerCase().includes(searchField.toLocaleLowerCase())
    );
    setArrFiltered(data);
  }, [searchField]);

  return (
    <View style={{ marginBottom: marginBottom }}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label} </Text>
          {required && <Text style={{ color: theme.customColors.error.default }}>*</Text>}
        </View>
      )}
      <TouchableOpacity
        onPress={() => {
          btSheetRef.current?.open();
        }}>
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text}
          mode="outlined"
          editable={false}
          error={error}
          onTouchEnd={() => {
            btSheetRef.current?.open();
          }}
          outlineColor="transparent"
          activeOutlineColor={theme.colors.text}
          underlineColor="transparent"
          style={styles.input}
          theme={{ fonts: { regular: { fontFamily: theme.fonts.semiBold } } }}
        />
        <View style={styles.arrow}>
          <ArrowIcon color={theme.customColors.neutrals[400]} width={24} height={24} />
        </View>
      </TouchableOpacity>

      <BottomSheet
        refRBSheet={btSheetRef}
        height={height / 2}
        background={theme.dark ? theme.colors.background : '#FFFFFF'}>
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.title}>{label ? label : placeholder}</Text>
          {withSearch && (
            <View>
              <Searchbar
                placeholder="Buscar"
                onChangeText={onChangeSearch}
                value={searchField || ''}
                iconColor={theme.colors.text}
                placeholderTextColor={theme.colors.text}
                inputStyle={styles.searchInput}
                style={styles.search}
                onIconPress={() => {
                  setSearchField('');
                }}
              />
            </View>
          )}
          <FlatList
            data={arrFiltered}
            style={{
              marginHorizontal: -16,
              borderTopWidth: 0.6,
              borderBottomWidth: 0.6,
              borderColor: theme.colors.border,
            }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <RadioButton.Item
                label={item.value}
                style={[styles.option, { justifyContent: 'space-between', width: '100%' }]}
                labelStyle={{ fontFamily: theme.fonts.regular, color: theme.colors.text }}
                color={theme.customColors.secondary.default}
                uncheckedColor={theme.colors.text}
                value={item.id}
                status={item.value === value ? 'checked' : 'unchecked'}
                onPress={() => {
                  btSheetRef.current?.close();
                  setValue({ ...form, [fieldName]: item.value });
                }}
              />
            )}
            ItemSeparatorComponent={() => (
              <Divider style={{ backgroundColor: theme.colors.border }} />
            )}
          />
        </View>
      </BottomSheet>
      {error && (
        <HelperText
          type="error"
          visible={error}
          theme={{ colors: { error: theme.customColors.error.default } }}>
          {txtError}
        </HelperText>
      )}
    </View>
  );
}
