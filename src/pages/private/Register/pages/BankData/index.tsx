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

export default function BankData({ formData, updateFormData, onNext, onPrev, isSubmitting = false }: BankDataProps) {
  const styles = useCustomStyles();
  const { theme } = useTheme();

  const [error, setError] = useState({
    bank_id: '',
    agency: '',
    account: '',
    account_digit: '',
  });

  const {
    data: banksData,
    isLoading: loadingBanks,
  } = useQuery({
    queryKey: ['getBanks'],
    queryFn: getBanks,
  });

  const banksArray = banksData?.data || banksData || [];

  const banksList = (Array.isArray(banksArray) ? banksArray : []).map((bank: any) => ({
    id: bank.id.toString(),
    value: `${bank.id} - ${bank.name}`,
  }));

  const banks = { list: banksList };

  const bankIdStr = formData.bank_id ? formData.bank_id.toString() : '';

  function handleNumericField(value: string, field: string) {
    const numericValue = value.replace(/[^0-9]/g, '');
    updateFormData({ [field]: numericValue });
    if (error[field as keyof typeof error]) {
      setError(prev => ({ ...prev, [field]: '' }));
    }
  }

  function handleBankSelect(id: string) {
    updateFormData({ bank_id: parseInt(id, 10) || 0 });
    if (error.bank_id) setError(prev => ({ ...prev, bank_id: '' }));
  }

  function validateFields() {
    const newErrors = {
      bank_id: !formData.bank_id ? 'Banco obrigatório' : '',
      agency: !formData.agency ? 'Agência obrigatória' : '',
      account: !formData.account ? 'Conta obrigatória' : '',
      account_digit: !formData.account_digit ? 'Dígito obrigatório' : '',
    };
    setError(newErrors);
    return Object.values(newErrors).every(e => !e);
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
            <View style={{ paddingVertical: 12 }}>
              <Text style={{ color: theme.colors.text }}>Carregando lista de bancos...</Text>
            </View>
          ) : (
            <Select
              label="Banco *"
              placeholder="Selecione um banco *"
              value={bankIdStr}
              setValue={() => {}}
              onSelect={handleBankSelect}
              form={{ bank_id: bankIdStr }}
              arr={banks}
              fieldName="bank_id"
              withSearch
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
          loading={isSubmitting}
          onPress={onConfirm}
          disabled={loadingBanks || isSubmitting}
          style={{ marginBottom: 15 }}
        />
      </View>
    </View>
  );
}
