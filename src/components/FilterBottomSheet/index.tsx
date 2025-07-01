import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import BottomSheet from '../BottomSheet';
import { useTheme } from '@/context/MyThemeContext';
import BtnIcon from '../BtnIcon';
import BtnDefault from '../BtnDefault';
import {useCustomStyles} from './style';
import CloseIcon from '@/../assets/newSvgs/icons/close_small.svg';

type Props = {
  refRBSheet: any;
  config: {
    height?: number;
    title: string;
    fields: Array<{
      title?: string;
      key: string;
      multiple?: boolean;
      fields: Array<{
        label: string;
        value: string;
        icon?: React.ReactNode;
        default?: boolean;
        fields?: any[];
      }>;
    }>;
    buttons: {
      clear: string;
      apply: string;
    };
    onApply: (filters: any) => void;
  };
};

export default function FilterBottomSheet({refRBSheet, config}: Props) {
  const {theme} = useTheme();
  const styles = useCustomStyles();

  const initializeSelectedFilters = useCallback(() => {
    const initialFilters: any = {};
    config.fields.forEach(group => {
      if (group.multiple) {
        initialFilters[group.key] = [];
      } else {
        group.fields.forEach(field => {
          if (field.default) {
            initialFilters[group.key] = field.value;
          }
        });
      }
    });
    return initialFilters;
  }, [config.fields]);

  const [selectedFilters, setSelectedFilters] = useState<any>(
    initializeSelectedFilters(),
  );
  const [activeFields, setActiveFields] = useState<any[]>([]);
  const [activeSubFields, setActiveSubFields] = useState<any[]>([]);
  const [currentGroupTitle, setCurrentGroupTitle] = useState<string>('');

  useEffect(() => {
    if (config.fields.length === 1 && !config.fields[0].fields[0]?.fields) {
      setActiveFields([config.fields[0]]);
    }
  }, [config.fields]);

  const toggleField = (field: any, groupKey?: string) => {
    if (field?.fields) {
      setActiveFields([field]);
      setActiveSubFields(field.fields || []);
      setCurrentGroupTitle(groupKey || field.title);
    } else {
      setActiveFields([field]);
      setActiveSubFields([]);
      handleSelect(groupKey || '', field.value, false, field.value);
    }
  };

  const handleClearFilters = () => {
    setSelectedFilters(initializeSelectedFilters());
    setActiveFields([]);
    setActiveSubFields([]);

    const defaultGroup = config.fields.find(group =>
      group.fields.some(field => field.default),
    );

    setCurrentGroupTitle(defaultGroup ? defaultGroup.key || '' : '');
  };

  const handleSelect = (
    groupKey: string,
    value: string,
    isSubField: boolean = false,
    parentField: string = '',
  ) => {
    setSelectedFilters((prev: any) => {
      const updatedFilters = {...prev};
      const group = config.fields.find(f => f.key === groupKey);
      const isMultiple = group?.multiple;

      if (isSubField) {
        Object.keys(updatedFilters).forEach(key => {
          if (key === parentField || key === groupKey) {
            delete updatedFilters[key];
          }
        });
        updatedFilters[groupKey] = value;
        return updatedFilters;
      }

      if (isMultiple) {
        if (!updatedFilters[groupKey]) {
          updatedFilters[groupKey] = [];
        }
        
        const currentValues = updatedFilters[groupKey];
        const valueIndex = currentValues.indexOf(value);
        
        if (valueIndex > -1) {
          currentValues.splice(valueIndex, 1);
        } else {
          currentValues.push(value);
        }
        
        if (currentValues.length === 0) {
          delete updatedFilters[groupKey];
        }
      } else {
        Object.keys(updatedFilters).forEach(key => {
          if (key.startsWith(groupKey) || key === value) {
            delete updatedFilters[key];
          }
        });
        updatedFilters[groupKey] = value;
      }
      
      setActiveSubFields([]);
      return updatedFilters;
    });
  };

  const isFieldSelected = (groupKey: string, value: string) => {
    const group = config.fields.find(f => f.key === groupKey);
    const isMultiple = group?.multiple;
    
    if (isMultiple) {
      return selectedFilters[groupKey]?.includes(value) || false;
    } else {
      return selectedFilters[groupKey] === value;
    }
  };

  const renderFields = (fields: any[], level = 0, groupKey?: string) => {
    return fields.map((field, index) => {
      const isActive = activeFields.includes(field);
      const isSelected = isFieldSelected(groupKey!, field.value);

      if (level === 0) {
        return (
          <View style={styles.section} key={index}>
            {field.title && (
              <Text style={styles.sectionTitle}>{field.title}</Text>
            )}
            <View style={styles.filterOptions}>
              {renderFields(field.fields, level + 1, field.key)}
            </View>
          </View>
        );
      }

      if (!field?.fields) {
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterOption,
              isSelected && styles.filterOptionSelected,
            ]}
            onPress={() => {
              handleSelect(groupKey || '', field.value, false, field.value);
              setActiveFields([]);
              setActiveSubFields([]);
            }}>
            <Text
              style={[
                styles.filterOptionText,
                isSelected && styles.filterOptionTextSelected,
              ]}>
              {field.label}
            </Text>
            <View style={styles.filterOptionIcon}>
              {React.isValidElement(field.icon)
                ? React.cloneElement(field.icon, {
                    fill: isSelected
                      ? theme.customColors.baseWhite
                      : theme.customColors.baseBlack,
                  })
                : field.icon}
            </View>
          </TouchableOpacity>
        );
      }

      return (
        <View key={index}>
          <TouchableOpacity
            onPress={() => toggleField(field, groupKey)}
            style={[
              styles.filterOption,
              isActive && styles.filterOptionSelected,
            ]}>
            <Text
              style={[
                styles.filterOptionText,
                isActive && styles.filterOptionTextSelected,
              ]}>
              {field.label}
            </Text>
          </TouchableOpacity>
        </View>
      );
    });
  };

  const renderExternalSubFields = () => {
    if (!activeSubFields.length) return null;

    return (
      <View style={[styles.filterOptions, styles.filterSubOptions]}>
        {activeSubFields.map((subField, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterOption,
              isFieldSelected(currentGroupTitle, subField.value) &&
                styles.filterOptionSelected,
            ]}
            onPress={() =>
              handleSelect(
                currentGroupTitle,
                subField.value,
                true,
                currentGroupTitle,
              )
            }>
            <Text
              style={[
                styles.filterOptionText,
                isFieldSelected(currentGroupTitle, subField.value) &&
                  styles.filterOptionTextSelected,
              ]}>
              {subField.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      draggable={false}
      height={config.height || undefined}
      background={
        theme.dark
          ? theme.customColors.neutrals[800]
          : theme.customColors.neutrals[100]
      }>
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Text style={styles.title}>{config.title}</Text>
          <BtnIcon
            style={styles.btnClose}
            width={28}
            height={28}
            bgColor={theme.customColors.baseWhite}
            onPress={() => refRBSheet.current?.close()}>
            <CloseIcon
              width={16}
              height={16}
              fill={theme.customColors.baseBlack}
            />
          </BtnIcon>
        </View>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View>{renderFields(config.fields)}</View>
          {renderExternalSubFields()}
          <View style={styles.buttonContainer}>
            <BtnDefault
              white
              label={config.buttons.clear}
              style={styles.button}
              onPress={handleClearFilters}
            />
            <BtnDefault
              label={config.buttons.apply}
              style={styles.button}
              onPress={() => config.onApply(selectedFilters)}
            />
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
