import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useCustomStyles } from '../../style';
import Input from '@/components/Input';
import Select from '@/components/Select';
import BtnDefault from '@/components/BtnDefault';
import { Analytics } from '@/helpers/analytics';
import { getBanks } from '@/services/common';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/context/MyThemeContext';
import ArrowBack from '@/../assets/newSvgs/icons/arrow_back.svg';

interface BankDataProps {
  formData: {
    bank_id: number;
    agency: string;
    account: string;
    account_digit: string;
  };
  updateFormData: (data: Partial<{
    bank_id: number;
    agency: string;
    account: string;
    account_digit: string;
  }>) => void;
  onNext: () => void;
  onPrev: () => void;
  isSubmitting?: boolean;
}

type BankOption = {
  id: string;
  value: string;
};

type SelectProps = {
  list: {
    id: string;
    value: string;
  }[];
};

export default function BankData({ formData, updateFormData, onNext, onPrev, isSubmitting = false }: BankDataProps) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  
  const [error, setError] = useState({
    bank_id: '',
    agency: '',
    account: '',
    account_digit: '',
  });

  const [selectedBank, setSelectedBank] = useState('');

  const {
    data: banksData,
    isLoading: loadingBanks,
    error: banksError,
  } = useQuery({
    queryKey: ['getBanks'],
    queryFn: getBanks,
  });

  const banksArray = banksData?.data || banksData || [];
  
  const banksList = (Array.isArray(banksArray) ? banksArray : []).map((bank: any) => ({
    id: bank.id.toString(),
    value: `${bank.id} - ${bank.name}`,
  }));

  const banks: SelectProps = {
    list: banksList,
  };

  function handleField(value: string, field: string) {
    updateFormData({ [field]: value });
    
    if (error[field as keyof typeof error]) {
      setError({ ...error, [field]: '' });
    }
  }

  function handleNumericField(value: string, field: string) {
    const numericValue = value.replace(/[^0-9]/g, '');
    updateFormData({ [field]: numericValue });
    
    if (error[field as keyof typeof error]) {
      setError({ ...error, [field]: '' });
    }
  }

  function handleBankChange(bankOption: string) {
    setSelectedBank(bankOption);
    
    if (bankOption) {
      const bankId = parseInt(bankOption.split(' - ')[0]);
      updateFormData({ bank_id: bankId });
    } else {
      updateFormData({ bank_id: 0 });
    }
    
    if (error.bank_id) {
      setError({ ...error, bank_id: '' });
    }
  }

  function validateFields() {
    const newErrors = {
      bank_id: !formData.bank_id ? 'Banco obrigatório' : '',
      agency: !formData.agency ? 'Agência obrigatória' : '',
      account: !formData.account ? 'Conta obrigatória' : '',
      account_digit: !formData.account_digit ? 'Dígito obrigatório' : '',
    };

    setError(newErrors);
    return Object.values(newErrors).every(error => !error);
  }

  async function onConfirm() {
    Analytics({ eventName: 'CadastroDadosBancarios_Continuar' });
    
    if (validateFields()) {
      onNext();
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'CadastroDadosBancarios' });
  }, []);

  useEffect(() => {
    if (formData.bank_id && banksList.length > 0) {
      const bank = banksList.find((b: BankOption) => b.id === formData.bank_id.toString());
      if (bank) {
        setSelectedBank(bank.value);
      }
    }
  }, [formData.bank_id, banksList]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.btnBackBlock}>
        <TouchableOpacity onPress={onPrev} style={styles.btnCancel}>
          <ArrowBack color={theme.colors.text} width={32} height={32} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Dados bancários</Text>
          
          {loadingBanks ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text>Carregando lista de bancos...</Text>
            </View>
          ) : (
                      <Select
            label="Banco *"
            placeholder="Selecione um banco *"
            value={selectedBank}
            setValue={(value: any) => {
              if (typeof value === 'object' && value.selectedBank) {
                handleBankChange(value.selectedBank);
              } else if (typeof value === 'string') {
                handleBankChange(value);
              }
            }}
            form={{ selectedBank }}
            arr={banks}
            fieldName="selectedBank"
            error={!!error.bank_id}
            txtError={error.bank_id}
            marginBottom={16}
          />
          )}
          
          <Input
            placeholder="Agência *"
            value={formData.agency}
            setValue={(value) => handleNumericField(typeof value === 'string' ? value : value(formData.agency), 'agency')}
            keyboardType="numeric"
            maxLength={4}
            error={!!error.agency}
            txtError={error.agency}
            marginBottom={16}
          />
          
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 3 }}>
              <Input
                placeholder="Conta *"
                value={formData.account}
                setValue={(value) => handleNumericField(typeof value === 'string' ? value : value(formData.account), 'account')}
                keyboardType="numeric"
                maxLength={11}
                error={!!error.account}
                txtError={error.account}
                marginBottom={16}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Dígito *"
                value={formData.account_digit}
                setValue={(value) => handleNumericField(typeof value === 'string' ? value : value(formData.account_digit), 'account_digit')}
                keyboardType="numeric"
                maxLength={1}
                error={!!error.account_digit}
                txtError={error.account_digit}
                marginBottom={16}
              />
            </View>
          </View>
        </View>
        
        <BtnDefault 
          label={isSubmitting ? "Enviando..." : "Continuar"} 
          onPress={onConfirm} 
          disabled={loadingBanks || isSubmitting}
          style={{ marginBottom: 15 }} 
        />
      </View>
    </View>
  );
}